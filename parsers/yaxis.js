/*
 * Y Parser
 */

start
  = list

list = head:label " and " tail:list {return head.concat(tail);}
  / head:label ", " tail:list {return head.concat(tail);}
  / head:label " vs " tail:list {return head.concat(tail);}
  / label

label
 = '"' label:[^"]* '"' {return [label.join("")];}
 / label:[^ "]* {return [label.join("")]}
