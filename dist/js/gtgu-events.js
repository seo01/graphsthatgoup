function eventTopCreate()
{
  _gaq.push(['_trackEvent',"top", "create", ""]);
}

function eventMidCreate()
{
  _gaq.push(['_trackEvent',"mid", "create", getEventLabel()]);
}

function eventBottomCreate()
{
  _gaq.push(['_trackEvent',"bottom", "create", getEventLabel()]);
}

function eventTopExample()
{
  _gaq.push(['_trackEvent',"top", "example", ""]);
}

function eventMidExample()
{
  _gaq.push(['_trackEvent',"mid", "example", getEventLabel()]);
}

function eventBottomExample()
{
  _gaq.push(['_trackEvent',"bottom", "example", getEventLabel()]);
}

function eventShare()
{
  _gaq.push(['_trackEvent',"bottom", "share", getEventLabel()]);
}

function eventInfo()
{
  _gaq.push(['_trackEvent',"bottom", "info", getEventLabel()]);
}

function eventShared()
{
  _gaq.push(['_trackEvent',"misc", "shared", getEventLabel()]);
}

function eventHome()
{
  _gaq.push(['_trackEvent',"misc", "home", ""]);
}

function getEventLabel()
{
  return $("#xAxis").val()+":"+$("#yAxis").val();
}