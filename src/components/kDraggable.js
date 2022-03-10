import React from "react";

import { Button } from "@progress/kendo-react-buttons";
import { draggableData, gridDataShow } from "./../draggableData";

/////////////////////////////////////////////////////////////////
// PLEASE CHECK dragHandler() METHOD AFTER UPDATING THIS FILE ///
/////////////////////////////////////////////////////////////////

function KDraggable(props) {
  const { dragHandler } = props;

  const rendersmallItem = (service, idCounter) => {
    return (
      <div
        className="new-service service-item"
        id={idCounter}
        data-start={service.TimeFrom}
        data-end={service.TimeTo}
        data-title={service.ServiceType}
        data-is-leave={service.isLeave}
      >
        <div className=" new-service service-item-time">
          {service.TimeFrom} - {service.TimeTo}
        </div>
        <div className="new-service service-item-title">
          {service.ServiceType}
        </div>
      </div>
    );
  };

  const renderService = (item, index) => {
    return (
      <div
        id={item.ServiceOrderNumber}
        className="new-service service-row"
        // onDrag={(ev) => dragHandler(ev)}
      >
        <div className="new-service service-title">{item.CaseNumber}</div>

        {item.ServiceItems.map((service, index2) => {
          return rendersmallItem(service, index2);
        })}
      </div>
    );
  };

  return (
    <div className="service-group">
      <div className="service-group-text">服務線</div>
      <div className="service-group-button">
        <Button>新增服務線</Button>
      </div>
      {gridDataShow.map((item, index) => {
        return renderService(item, index);
      })}
    </div>
  );
}

export default KDraggable;
