//add listener
document.addEventListener("dragover", function (ev) {
  ev.preventDefault();
});

var mouseDownded = false;
var globalCheckMouseDownSetInterval;
var mouseX;
var mouseY;
var draggingScheduleGroup;

function addNewRowToDataResource(index) {
  console.log(index);
  var scheduler = $("#scheduler").data("kendoScheduler");
  var resources = scheduler.resources[0];
  var newDataResource = [];
  var newValue = dataResource.length;
  var item;
  var n = 0;
  for (var i = 0; i < dataResource.length; i++) {
    item = dataResource[i];
    if (item.value == dataResource[index].value) {
      newDataResource.push({
        id: item.id + n,
        text: item.text,
        value: item.value,
        extraBuffer: false,
        removable: item.removable,
      });
      n++;
      newValue = item.text + " (Extra)";
      newDataResource.push({
        id: item.id + n,
        text: item.text + " (Extra)",
        value: item.text + " (Extra)",
        extraBuffer: false,
        removable: true,
      });
      resources.dataSource.pushInsert(index + 1, {
        id: item.id + n,
        text: item.text + " (Extra)",
        value: item.text + " (Extra)",
        extraBuffer: false,
        removable: true,
      });
    } else {
      newDataResource.push({
        id: item.id + n,
        text: item.text,
        value: item.value,
        extraBuffer: item.extraBuffer,
        removable: item.removable,
      });
    }
  }
  dataResource = newDataResource;
  scheduler.view(scheduler.view().name);

  return newValue;
}

function removeResources(index_in_array) {
  var scheduler = $("#scheduler").data("kendoScheduler");
  var resources = scheduler.resources[0];
  console.log(index_in_array);
  resources.dataSource.remove(resources.dataSource.at(index_in_array));
  scheduler.view(scheduler.view().name);

  // remove from self array

  dataResource.splice(index_in_array, 1);
  dataResource[index_in_array - 1].extraBuffer = true;
}

function removeExtraRow(index_in_array) {
  console.log(index_in_array);
  console.log(dataResource);
  console.log(schedulerData);
  var scheduler = $("#scheduler").data("kendoScheduler");
  var valueToChange = dataResource[index_in_array + 1].value;
  removeResources(index_in_array + 1);
  console.log(valueToChange);

  for (var i = 0; i < schedulerData.length; i++) {
    console.log(schedulerData[i].assignedId);
    console.log(dataResource[index_in_array].value);
    if (schedulerData[i].assignedId == valueToChange) {
      schedulerData[i].assignedId = dataResource[index_in_array].value;
    }
  }
  console.log(schedulerData);

  for (const data of schedulerData) {
    console.log(data.assignedId);
  }
  var newDataSource = new kendo.data.SchedulerDataSource({
    data: schedulerData,
  });
  scheduler.setDataSource(newDataSource);
  console.log(index_in_array);
}

document.addEventListener("mousemove", function (ev) {
  mouseX = ev.pageX + 10;
  mouseY = ev.pageY + 10;
});

document.addEventListener("mousedown", function (ev) {
  draggingScheduleGroup = {};
  mouseDownded = true;
  var index;
  setTimeout(() => {
    while (mouseDownded && !document.getElementById("dragging-item")) {
      console.log("you are holding it");

      const trs = document.querySelectorAll(
        ".k-scheduler-content .k-scheduler-table tr"
      );
      // it either click on the row, or the k-event, or the new-added row
      if (
        ev.target.classList.contains("leave-item") ||
        ev.target.classList.contains("normal-item") ||
        ev.target.classList.contains("k-event")
      ) {
        //clicked on event
        console.log("you holding on the event");
        var ele = ev.target;
        while (!ele.classList.contains("k-event")) {
          ele = ele.parentNode;
        }
        const target_uid = ele.getAttribute("data-uid");
        var scheduler = $("#scheduler").data("kendoScheduler");
        var scheduler_Data = scheduler._data;

        var assignedId = scheduler_Data.find((obj) => {
          return target_uid == obj.uid;
        }).assignedId;
        console.log(scheduler_Data);
        var draggableSchedule = [];
        for (var j = 0; j < scheduler_Data.length; j++) {
          if (scheduler_Data[j].assignedId == assignedId) {
            draggableSchedule.push(scheduler_Data[j]);
          }
        }
        var index = undefined;
        for (var i = 0; i < dataResource.length; i++) {
          if (dataResource[i].value == assignedId) {
            index = i;
          }
        }
        draggingScheduleGroup = {
          index: "a" + assignedId,
          schedule: draggableSchedule,
        };
        renderDraggableObjectHTML(
          generateDraggableObjectHTML(draggableSchedule)
        );
        console.log(draggingScheduleGroup);
        draggableSchedule = [];
      } else if (ev.target.classList.contains("new-service")) {
        // if clicked on a new service
        console.log("You holding on the new-service");
        var ele = ev.target;
        while (!ele.classList.contains("service-row")) {
          ele = ele.parentNode;
        }

        const serviceItems = ele.querySelectorAll(".service-item");
        var draggableSchedule = [];
        for (const item of serviceItems) {
          index = item.id;
          draggableSchedule.push({
            title: item.getAttribute("data-title"),
            start: item.getAttribute("data-start"),
            end: item.getAttribute("data-end"),
            isLeave: item.getAttribute("data-is-leave") === "true",
          });
        }
        renderDraggableObjectHTML(
          generateDraggableObjectHTML(draggableSchedule)
        );
        draggingScheduleGroup = {
          index: "b" + ele.getAttribute("id"),
          schedule: draggableSchedule,
        };
      } else {
        // click on time slot
        console.log("holding on time slot");

        ele = ev.target;
        index = undefined;
        var isTimeSlot = false;
        for (var i = 0; i < trs.length; i++) {
          const tds = trs[i].querySelectorAll("td");
          for (const td of tds) {
            if (td === ev.target) {
              // index;
              isTimeSlot = true;
              index = i;
            }
          }
        }
        console.log(index);
        if (!isTimeSlot) {
          console.log("you are clciking other un-related area");
          return;
        }

        // this index is refering to the row,
        // now need to check it representing which set of schedule using dataResource
        var trueIndex = dataResource[index].value;

        index = trueIndex;

        var scheduler = $("#scheduler").data("kendoScheduler");
        var scheduler_Data = scheduler._data;
        var draggableSchedule = [];
        for (var j = 0; j < scheduler_Data.length; j++) {
          if (scheduler_Data[j].assignedId == index) {
            draggableSchedule.push(scheduler_Data[j]);
          }
        }
        console.log(draggableSchedule.length);
        if (draggableSchedule.length !== 0) {
          renderDraggableObjectHTML(
            generateDraggableObjectHTML(draggableSchedule)
          );
          draggingScheduleGroup = {
            index: "a" + index,
            schedule: draggableSchedule,
          };
        }
        draggableSchedule = [];
      }
      if (draggingScheduleGroup.index !== undefined) {
        // if have index, that mean it clicked on the time slot pr event
        console.log(draggingScheduleGroup.index);
      } else {
        // need to check if it clicked on the new-service
        console.log("no index");
        mouseDownded = false;
      }
    }
    console.log(mouseDownded);
    if (mouseDownded) {
      globalCheckMouseDownSetInterval = setInterval(function () {
        console.log("setinterval firing");
        if (mouseDownded && document.getElementById("dragging-item")) {
          // console.log("yes you are still holding it");
          var draggingItem = document.getElementById("dragging-item");
          draggingItem.style.left = mouseX + "px";
          draggingItem.style.top = mouseY + "px";
          draggingItem.style.display = "block";
        } else {
          console.log("you released");
          mouseDownded = false;
        }
      }, 50);
    }
  }, 100);
});

document.addEventListener("mouseup", function (ev) {
  mouseDownded = false;

  console.log("mouse up");
  if (document.getElementById("dragging-item")) {
    document.getElementById("dragging-item").remove();
  }

  clearInterval(globalCheckMouseDownSetInterval);

  var index;
  console.log(ev.target);
  if (
    //clicked on event
    ev.target.classList.contains("leave-item") ||
    ev.target.classList.contains("normal-item")
  ) {
    console.log(" you release on the event");
    var ele = ev.target;
    while (!ele.classList.contains("k-event")) {
      ele = ele.parentNode;
    }
    const target_uid = ele.getAttribute("data-uid");
    // console.log(target_uid);
    var scheduler = $("#scheduler").data("kendoScheduler");
    var scheduler_Data = scheduler._data;
    var targetAssignedId = scheduler_Data.find((obj) => {
      return obj.uid == target_uid;
    }).assignedId;

    for (var i = 0; i < dataResource.length; i++) {
      if (dataResource[i].value == targetAssignedId) {
        index = i;
      }
    }
  } else {
    const trs = document.querySelectorAll(
      ".k-scheduler-content .k-scheduler-table tr"
    );
    // click on time slot
    console.log("release on time slot");

    ele = ev.target;

    for (var i = 0; i < trs.length; i++) {
      const tds = trs[i].querySelectorAll("td");
      for (const td of tds) {
        if (td === ev.target) {
          // index;
          index = i;
        }
      }
    }
  }
  var assignedId = dataResource[index].value;

  if (index !== undefined) {
    // if dropped on either row of the scheduler

    if (draggingScheduleGroup.index) {
      console.log(draggingScheduleGroup.index);
      if (draggingScheduleGroup.index == "a" + assignedId) {
        console.log("drag and drop are same location, no effect");
      } else {
        // console.log(draggingScheduleGroup.schedule);
        scheduler = $("#scheduler").data("kendoScheduler");
        // within scheduler
        // case 1 => from row(have schedule) to row(have schedule) a>a add
        // case 2 => from row(have schedule) to row(have no schedule) a>a move
        // case 3 => from row(new service) to row(have schedule) b>a add
        // case 4 => from row(new service) to row(have no schedule) b>a add
        if (draggingScheduleGroup.index[0] == "a") {
          console.log("it is dragged from scheduler");
          //case 1 and 2
          var haveSchedule = false;
          for (const serviceItem of schedulerData) {
            if (serviceItem.assignedId == assignedId) {
              haveSchedule = true;
            }
          }
          if (haveSchedule) {
            // case 1 => from row(have schedule) to row(have schedule) a>a add
            console.log(draggingScheduleGroup);
            console.log("dropped row already has schedule");
            // case 1a => target row has buffer
            // case 1b => target row has no buffer
            // case 1c => sourceRow is removable or not

            console.log(index);
            var target = dataResource.find((obj) => {
              return obj.value == assignedId;
            });
            console.log(target);
            if (target.extraBuffer) {
              console.log("has buffer");

              // case 1a => target row has buffer

              var fromId = draggingScheduleGroup.index.slice(
                1,
                draggingScheduleGroup.index.length
              );

              var newValue = addNewRowToDataResource(index);
              console.log(newValue);
              for (var i = 0; i < schedulerData.length; i++) {
                if (schedulerData[i].assignedId == fromId) {
                  schedulerData[i].assignedId = newValue;
                }
              }
              var newDataSource = new kendo.data.SchedulerDataSource({
                data: schedulerData,
              });
              scheduler.setDataSource(newDataSource);
              var index_in_array;
              for (var i = 0; i < dataResource.length; i++) {
                if (dataResource[i].value == fromId) {
                  index_in_array = i;
                }
              }
              var fromObj = dataResource.find((obj) => {
                return obj.value == fromId;
              });
              if (fromObj.removable == true) {
                console.log("removable is true");
                removeResources(index_in_array);
              } else {
                if (fromObj.extraBuffer == false) {
                  // that mean the Sunny Chan is empty but Sunny Chan (Extra) has schedule
                  // we need to move the extra back to the original row
                  removeExtraRow(index_in_array);
                }
                console.log("removable is false");
              }
            } else {
              // case 1b => target row has no buffer
              console.log("no buffer bye bye");
            }
          } else {
            console.log("dropped row has no schedule");
            // case 2 => from row(have schedule) to row(have no schedule) a>a move
            // case 2a => move from a removale row
            // case 2b => move from a non-removale row
            console.log(draggingScheduleGroup);
            var index_in_array;
            var fromId = draggingScheduleGroup.index.slice(
              1,
              draggingScheduleGroup.index.length
            );
            for (var i = 0; i < dataResource.length; i++) {
              if (dataResource[i].value == fromId) {
                index_in_array = i;
              }
            }
            var fromObj = dataResource.find((obj) => {
              return obj.value == fromId;
            });

            console.log(index_in_array);

            console.log(schedulerData);
            for (var i = 0; i < schedulerData.length; i++) {
              if (schedulerData[i].assignedId == fromObj.value) {
                schedulerData[i].assignedId = assignedId;
              }
            }
            var newDataSource = new kendo.data.SchedulerDataSource({
              data: schedulerData,
            });
            scheduler.setDataSource(newDataSource);
            if (fromObj.removable == true) {
              console.log("removable is true");
              removeResources(index_in_array);
            } else {
              if (fromObj.extraBuffer == false) {
                removeExtraRow(index_in_array);
              }
              console.log("removable is false");
            }
          }
        } else {
          //case 3 and 4
          console.log("it is dragged from new-service");
          var haveSchedule = false;
          dataResource_representing_value = dataResource[index].value;
          for (const serviceItem of schedulerData) {
            console.log(serviceItem.assignedId);
            if (serviceItem.assignedId == dataResource_representing_value) {
              haveSchedule = true;
            }
          }
          if (haveSchedule) {
            console.log("dropped row already has schedule");
            // case 3 => from row(new service) to row(have schedule) b>a add
            // either can add or cannot add (cannot add because already have one buffer schedule)

            var resources = scheduler.resources[0];

            if (dataResource[index].extraBuffer) {
              var newValue = addNewRowToDataResource(index);
              ////////////////////////////////////////////////////
              // here we need to manage BOTH dataResource and   //
              // the resource.DataSource in the kendo schduler  //
              ////////////////////////////////////////////////////

              //add event now
              console.log(draggingScheduleGroup.schedule);
              for (const item of draggingScheduleGroup.schedule) {
                schedulerData.push({
                  id: schedulerData.length,
                  title: item.title,
                  start: genDateTime(item.start),
                  end: genDateTime(item.end),
                  isLeave: item.isLeave,
                  caseName: "",
                  caseNumber: "",
                  serviceOrderNumber: "",
                  assignedTo: index,
                  assignedId: newValue,
                });
              }
              console.log(schedulerData);
              var newDataSource = new kendo.data.SchedulerDataSource({
                data: schedulerData,
              });
              scheduler.setDataSource(newDataSource);
            } else {
              console.log("cannot add la, no buffer la");
            }
          } else {
            // case 4 => from row(new service) to row(have no schedule) b>a add
            index = dataResource[index].id;
            console.log("dropped row has no schedule yet");

            for (const item of draggingScheduleGroup.schedule) {
              schedulerData.push({
                id: schedulerData.length,
                title: item.title,
                start: genDateTime(item.start),
                end: genDateTime(item.end),
                isLeave: item.isLeave,
                caseName: "",
                caseNumber: "",
                serviceOrderNumber: "",
                assignedTo: index,
                assignedId: dataResource[index].value,
              });
            }
            var newDataSource = new kendo.data.SchedulerDataSource({
              data: schedulerData,
            });
            scheduler.setDataSource(newDataSource);
          }
          // after dropping the Schedule, please remove the schedule from kdraggable
          document
            .getElementsByClassName("service-row")
            [parseInt(draggingScheduleGroup.index[1])].classList.add("removed");
        }
      }
    } else {
      console.log("nothing on the drag objcet");
    }
  } else {
    console.log("you are not dropping on the scheduler");
  }

  draggingScheduleGroup = {};
  clearInterval(globalCheckMouseDownSetInterval);
  console.log("cleared");
});
