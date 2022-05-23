function dateToString(d) {
  const dateObject = new Date(d.toMillis());
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  
  return year + "-" + month + "-" + day;
}

export default dateToString;