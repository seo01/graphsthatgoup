/*
 * X Parser
 */

start
  = daterange
  / list
  / label

daterange
 = left:date " to " right:date {return {type:"DATE",from:left,to:right};}
 / left:date " "? "-" " "? right:date {return {type:"DATE",from:left,to:right}}

date
 = year:[0-9]+ {return new Date(year.join(""));}

list = listitems:listitems {return {type:"LIST",items:listitems}}

listitems = head:listitem " and " tail:listitems {return head.concat(tail);}
  / head:listitem ", " tail:listitems {return head.concat(tail);}
  / head:listitem " vs " tail:listitems {return head.concat(tail);}
  / listitem

listitem
 = '"' label:[^"]* '"' {return [label.join("")];}
 / label:[^ "]* {return [label.join("")]}

label
 = label:listitem {return {type:"LABEL",label:label.join("")};}