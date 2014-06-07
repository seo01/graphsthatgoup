/*
 * X Parser
 */

start
  = daterange
  / label

daterange
 = left:date " to " right:date {return {type:"DATE",from:left,to:right};}
 / left:date " "? "-" " "? right:date {return {type:"DATE",from:left,to:right}}

date
 = year:[0-9]+ {return new Date(year.join(""));}

label
 = '"' label:[^"]* '"' {return {type:"LABEL",label:label.join("")};}
 / label:.* {return {type:"LABEL",label:label.join("")};}