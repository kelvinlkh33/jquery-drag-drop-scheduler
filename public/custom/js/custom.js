// document.getElementById("add-button").addEventListener("click", function () {
//   var scheduler = $("#scheduler").data("kendoScheduler");
//   console.log(scheduler);
//   scheduler.options.majorTick = "30";
//   scheduler.view(scheduler.view().name); //to dynamically update the scheduler
//   console.log("success");
// });

function dateObjectToStringTime(dateObject) {
  return [
    (dateObject.getHours() > 9 ? "" : "0") + dateObject.getHours(),
    (dateObject.getMinutes() > 9 ? "" : "0") + dateObject.getMinutes(),
  ].join(":");
}

function generateDraggableObjectHTML(dataArray) {
  // dataArray => array of {title, start, end, isLeave}
  var HTMLString = `<div id="dragging-item" class="dragging-item dragging-group">`;
  for (const data of dataArray) {
    HTMLString +=
      `
      <div class="dragging-item dragging-service-item 
      ` +
      (data.isLeave ? "dragging-leave-item" : "dragging-normal-item") +
      `"><div class="dragging-item dragging-item-time">` +
      (typeof data.start == "object"
        ? dateObjectToStringTime(data.start)
        : data.start) +
      " - " +
      (typeof data.end == "object"
        ? dateObjectToStringTime(data.end)
        : data.end) +
      "</div>" +
      `<div class="dragging-item dragging-item-title">` +
      data.title +
      `
      </div></div>
    `;
  }
  // console.log(HTMLString);
  return HTMLString + "</div>";
}

function renderDraggableObjectHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString;
  document.getElementById("draggable-area").innerHTML += htmlString;
}
