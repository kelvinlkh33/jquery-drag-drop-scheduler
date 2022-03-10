// schedulerData => data in the kendo scheduler ui
// dataResource => the data for grouping on kendo scheduler ui
// the draggable data please see kdraggable.js

var rawData = [
  {
    CaseName: "Sunny Chan",
    CaseNumber: "SCC-01-002",
    ServiceOrderNumber: "SO001-2022",
    AssignedTo: "Sunny Chan",
    ServiceItems: [
      // {
      //   TimeFrom: "9:00",
      //   TimeTo: "10:30",
      //   ServiceType: "Personal Care",
      // },
      // {
      //   TimeFrom: "14:00",
      //   TimeTo: "15:00",
      //   ServiceType: "Shopping",
      // },
      // {
      //   TimeFrom: "15:30",
      //   TimeTo: "16:15",
      //   ServiceType: "Meal Delivery",
      // },
    ],
  },
  {
    CaseName: "Kelvin Leung",
    CaseNumber: "SCC-02-002",
    ServiceOrderNumber: "SO002-2022",
    AssignedTo: "Kelvin Leung",
    ServiceItems: [
      {
        TimeFrom: "09:00",
        TimeTo: "10:15",
        ServiceType: "Leave",
        isLeave: true,
      },
      {
        TimeFrom: "12:00",
        TimeTo: "15:30",
        ServiceType: "Shopping",
        isLeave: false,
      },
      {
        TimeFrom: "16:00",
        TimeTo: "18:15",
        ServiceType: "Meal Delivery",
        isLeave: false,
      },
    ],
  },
  {
    CaseName: "Gordon Lau",
    CaseNumber: "SCC-02-003",
    ServiceOrderNumber: "SO003-2022",
    AssignedTo: "Gordon Lau",
    ServiceItems: [
      {
        TimeFrom: "9:15",
        TimeTo: "11:30",
        ServiceType: "Personal Care",
        isLeave: false,
      },
      {
        TimeFrom: "12:00",
        TimeTo: "16:30",
        ServiceType: "Shopping",
        isLeave: false,
      },
      {
        TimeFrom: "17:00",
        TimeTo: "18:15",
        ServiceType: "Meal Delivery",
        isLeave: false,
      },
    ],
  },
];

const todayObject = new Date();

const today = [
  todayObject.getFullYear(),
  (todayObject.getMonth() + 1 > 9 ? "0" : "") + (todayObject.getMonth() + 1),
  (todayObject.getDate() > 9 ? "0" : "") + todayObject.getDate(),
].join("/");

function genDateTime(time) {
  return new Date(today + " " + time);
}

var schedulerData = [];
var dataResource = [];

var id = 0;
var assignedId = 0;
for (const item of rawData) {
  dataResource.push({
    id: assignedId, // also representing the row in in the scheduler
    text: item.CaseName,

    value: item.CaseName,
    extraBuffer: true,
    removable: false,
  });
  for (const serviceItem of item.ServiceItems) {
    schedulerData.push({
      id: id++,
      title: serviceItem.ServiceType,
      start: genDateTime(serviceItem.TimeFrom),
      end: genDateTime(serviceItem.TimeTo),
      isLeave: serviceItem.isLeave,
      caseName: item.CaseName,
      caseNumber: item.CaseNumber,
      serviceOrderNumber: item.ServiceOrderNumber,
      assignedTo: item.AssignedTo,
      assignedId: item.CaseName,
      class: item.isLeave ? "leave-item" : "normal-item",
    });
  }
  assignedId += 1;
}

console.log(dataResource);
