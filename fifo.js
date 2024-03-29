// считывает закупки
function get_supplies(sheet, row, col)
{
  var label = null;
  var array_labels = [];
  var array_count = [];
  var array_price = [];
  var n = row;
  while(1)
  {
    label = sheet.getRange(n, col).getValue();
    if (label != "")
    {
      var count = sheet.getRange(n, col+1).getValue();
      var price = sheet.getRange(n, col+2).getValue();;
      if (!array_labels.includes(label))
      {
        array_labels.push(label);
        array_count.push([count]);
        array_price.push([price]);
      }
      else
      {
        var num = array_labels.indexOf(label);
        array_count[num].push(count);
        array_price[num].push(price);
      }
      n++;
    }
    else break;
  }
  return [array_labels, array_count, array_price];
}

function value_out(sheet, row, col, sum, status)
{
  sheet.getRange(row, col).setValue(sum);
  sheet.getRange(row, col + 1).setValue(status);
}

function get_prices(sheet, row, col, list_of_sup)
{
  var label = null;
  var n = row;
  while(1)
  {
    label = sheet.getRange(n, col).getValue();
    if (label != "")
    {
      var sum;
      var status = "";
      var count = sheet.getRange(n, col+1).getValue();
      var index = list_of_sup[0].indexOf(label);
      
      if (index == -1)
      {
        sum = -1;
        status = "the goods were not delivered";
      }
      else
      {
        sum = 0;
        var listCount = list_of_sup[1][index];
        var listPrice = list_of_sup[2][index];
        for (let i = 0; i < listCount.length; i++)
        {
          if (count <= listCount[i])
          {
            listCount[i] -= count;
            sum += listPrice[i] * count;
            count = 0;
            break;
          }
          else
          {
            count -= listCount[i];
            sum += listCount[i] * listPrice[i];
            listCount[i] = 0;
          }
        }

        if (count > 0)
        {
          if(sum != 0) 
          {
            status = "there are not enough goods";
          }
          else
          {
            status = "there are no goods left in stock"
          }
        }

        while(listCount[0] == 0)
        {
          listCount.shift();
          listPrice.shift();
        }
      }
      value_out(sheet, n, col+2, sum, status);
      n++;
    }
    else break;
  }
}

// считывает настройки
function get_settings(settings)
{
  var sheet_name = settings.getRange(2, 2).getValue();
  var row = settings.getRange(3, 2).getValue();
  var col = settings.getRange(4, 2).getValue();
  var price_sheet_name = settings.getRange(7, 2).getValue();
  var price_row = settings.getRange(8, 2).getValue();
  var price_col = settings.getRange(9, 2).getValue();
  return [sheet_name, row, col, price_sheet_name, price_row, price_col];
}

function fifo_price() 
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var settings = get_settings(ss.getSheetByName("settings_fifo"));
  
  var sheet_name = settings[0];
  var row = settings[1];
  var col = settings[2];

  var price_sheet_name = settings[3];
  var price_row = settings[4];
  var price_col = settings[5];


  var sheet = ss.getSheetByName(sheet_name)
  var list = get_supplies(sheet, row, col);


  var sheet2 = ss.getSheetByName(price_sheet_name);
  get_prices(sheet2, price_row, price_col, list);
  

}

