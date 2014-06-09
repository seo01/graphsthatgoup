
var ALGO = ["LINEAR", "EXPO", "HOCKY"];

var CHARTTYPE = ["BAR","LINE"];

var exampleIndex = 0;

function randomElementFromArray(items)
{
  var item = items[Math.floor(Math.random()*items.length)];
  return item;
}

function generateData(points)
{
  var algo = randomElementFromArray(ALGO);
  var data = [];
  if(algo == "LINEAR") //linear
  {
    for(var i = 0; i < points; i++)
    {
      data.push(i/(points-0.1) + 0.1);
    }
  }
  else if(algo == "EXPO")
  {
    for(var i = 0; i < points; i++)
    {
      data.push(Math.pow(i/(points-0.1) + 0.1,3));
    }
  }
  else
  {
   for(var i = 0; i < points; i++)
    {
      if(i < points-1)
        data.push(i/(points/0.3-0.1) + 0.1);
      else
        data.push(i/(points-0.1) + 0.1);
    } 
  }

  return jitter(data);
}

function generateMultiData(points,numSeries)
{
  var series = [];
  for(var i = 0; i < numSeries; i++)
  {
    series.push(generateData(points));
  }
  return series;
}

function generateDateSteps(from, to, increment)
{
  dates = [from]
  while(dates[dates.length-1] < to)
  {
    dates.push(new Date(dates[dates.length-1].getTime()+increment));
  }
  return dates;
}

var DATE_PERIODS = [6311433600000,1577923200000,631152000000,315619200000,157852800000,
  63158400000,31622400000,15901200000,5270400000,2678400000];
var DATE_FORMATS = ["%Y","%Y","%Y","%Y","%Y",
  "%Y","%Y","%y-%b","%y-%b","%y-%b"]

var TARGET_RANGE = [3,12];

function getXValues(input)
{
  //if dates parse as dates
  //if numbers parse as numbers
  //else return string
  var title = null, ticks = null, showticks = null, tickformat = null, istime = false;
  try
  {
    var parsedInput = xaxisparser.parse(input);
    if(parsedInput.type == "DATE")
    {
      period = parsedInput.to - parsedInput.from;
      for(var i = 0; i < DATE_PERIODS.length; i++)
      {
        var testPeriod = DATE_PERIODS[i];
        if(period/testPeriod >= TARGET_RANGE[0] & period/testPeriod <= TARGET_RANGE[1])
        {
          ticks = generateDateSteps(parsedInput.from,parsedInput.to,testPeriod);
          istime = true;
          tickformat = DATE_FORMATS[i];
          showticks = true;
          break;
        }
      }
      if(ticks == null)
      {
        title = input;
        ticks = [0,1,2,3,4,5,6,7,8,9];
        showticks = false;
      }
    }
    else if(parsedInput.type == "LIST")
    {
      if(parsedInput.items.length > 1)
      {
        ticks = []
        for(var i = 0; i < parsedInput.items.length; i++)
          ticks.push(i);
        tickformat = function (t) {return parsedInput.items[t];};
        showticks = true;
      }
      else
      {
        title = input;
        ticks = [0,1,2,3,4,5,6,7,8,9];
        showticks = false;
      }
    }
    else
    {
      title = parsedInput.label;
      ticks = [0,1,2,3,4,5,6,7,8,9];
      showticks = false;
    }
  }
  catch(err)
  {
    title = input;
    ticks = [0,1,2,3,4,5,6,7,8,9];
    showticks = false;
  }
  return {title:title, ticks:ticks, showticks:showticks, tickformat:tickformat, istime:istime};
}

function getSeries(input)
{
  try{
    var parsedInput = yaxisparser.parse(input);
    if(parsedInput.length > 8)
      return [input];
    return parsedInput;
  }
  catch(err)
  {
    return [input];
  }
}

function jitter(data)
{
  var newData = [];
  var shift = 0.1*Math.random();
  for(var i = 0; i < data.length; i++)
  {
    newData.push(data[i]*(0.7+0.3*Math.random()+shift));
  }
  return newData;
}

function createExample()
{
  exampleIndex +=1;
  if(exampleIndex >= EXAMPLES.length)
    exampleIndex = 0;
  $("#xAxis").val(EXAMPLES[exampleIndex][0]);
  $("#yAxis").val(EXAMPLES[exampleIndex][1]);

  reCreateGraph();
}

function writeHash(xval,yval,seed)
{
  if(xval != "" & yval != "")
    window.location.hash = "x="+encodeURIComponent(xval)+"&y="+encodeURIComponent(yval)+
      "&s="+encodeURIComponent(seed);
  $('#tweetbutton').attr('href','https://twitter.com/intent/tweet?hashtags=graphsthatgoup&text=Check%20out%20this%20graph!&tw_p=tweetbutton&url='+encodeURIComponent(window.location.toString()));

}

function readValueFromHash(value)
{
  var args = window.location.hash.substring(1).split("&");
  for(var i = 0; i < args.length; i++)
  {
    var parts = args[i].split("=");
    if(parts[0]==value)
    {
      if(parts.length > 1)
        return decodeURIComponent(parts[1]);
      else
        return "";
    }
  }
  return null;
}

function initGraph()
{
  var xval = readValueFromHash("x");
  var yval = readValueFromHash("y");
  var seed = readValueFromHash("s");

  if(xval != null & yval != null & seed != null)
  {
    $("#xAxis").val(xval);
    $("#yAxis").val(yval);
    createGraph(xval,yval,seed);
    hideInfo();
    scrollToElement('#create');
    $('#final').show();
  }
  else
  {
    createGraph("","","");
  }
}

function reCreateGraph()
{
  hideInfo();
  if(animateOut)
  {
    animateOut();
    setTimeout(createGraph,1000);
  }
  else
  {
    createGraph();
  }
}

function createGraph(xval,yval,seed)
{
  if(xval == null)
  {
    xval = $("#xAxis").val();
  }
  if(yval == null)
  {
    yval = $("#yAxis").val();
  }
  if(xval == "" & yval == "" & seed == null)
  {
    return createExample();
  }
  if(seed == null)
  {
    seed = (new Date()).getTime().toString();
  }
  Math.seedrandom(seed);

  writeHash(xval,yval,seed);

  //xValues are either dates or a label
  var xValues = getXValues(xval);
  var series = getSeries(yval);

  //yValues is one or more labels 
  var yValues = generateMultiData(xValues.ticks.length,series.length);

  var colors = randomElementFromArray(COLORS[series.length-1].concat(COLORS[series.length]).concat(COLORS[series.length+1]));//TODO append the next two colors as well
  
  var chartType = (xValues.showticks && xValues.istime)?randomElementFromArray(CHARTTYPE):CHARTTYPE[0];

  renderGraph(xValues,yValues,series,colors,chartType,"#graph");
}