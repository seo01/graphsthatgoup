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
 = '"' label:.* '"' {return {type:"LABEL",label:label.join("")};}
 / label:.* {return {type:"LABEL",label:label.join("")};}


//additive
//  = left:multiplicative "+" right:additive { return left + right; //}
//  / multiplicative

//multiplicative
//  = left:primary "*" right:multiplicative { return left * right; }
//  / primary

//primary
//  = integer
//  / "(" additive:additive ")" { return additive; }

//integer "integer"
//  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }