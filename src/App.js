import logo from "./logo.svg";
import "./App.css";
import KDraggable from "./components/kDraggable";

function App() {
  const dragHandler = (ev) => {
    // console.log("hello world");
    // console.log(ev.pageX);
    var ele = ev.target;
    while (!ele.classList.contains("service-row")) {
      ele = ele.parentNode;
    }
    // console.log(ele);
    if (document.getElementById("dragging-element") == null) {
      console.log(ele);

      var htmlString = `<div id="dragging-element">` + ele.innerHTML + `</div>`;
      var div = document.createElement("div");
      div.innerHTML = htmlString;
      document.getElementById("draggable-area").innerHTML += htmlString;
      console.log("added element");
    } else {
      var draggableEle = document.getElementById("dragging-element");
      // console.log(ev.pageX);
      draggableEle.style.left = ev.pageX + "px";
      draggableEle.style.top = ev.pageY + "px";
      // console.log("moving");
    }
  };

  return (
    <div className="App">
      <KDraggable dragHandler={dragHandler}></KDraggable>
    </div>
  );
}

export default App;
