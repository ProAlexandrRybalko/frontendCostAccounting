let allAccountings = [];


window.onload = async function () {
  const response = await fetch("http://localhost:8000/allAccountings", {
    method: "GET"
  });

  const result = await response.json();

  let i = 0;
  while (i < result['accountings'].length) {
    allAccountings.push({
      data: result['accountings'],
      isVisibleCheck: false
    });

    i++;
  }

  render();
}

const setClassName = (elem ,name) => {
  elem.className = name;
}

const appendKid = (parent, child) => {
  parent.appendChild(child);
}

const render = () => {
  const content = document.getElementById('view-accounting');
  const sum = document.getElementById("sum");
  let sumValue = 0;

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  while (sum.firstChild) {
    sum.removeChild(sum.firstChild);
  }

  allAccountings.map((item, index) => {
    const accounting = document.createElement("div");
    const where = document.createElement("div");
    const whereValue = document.createElement("p");
    const date = document.createElement("div");
    const dateValue = document.createElement("p");
    const howMuch = document.createElement("div");
    const howMuchValue = document.createElement("p");
    const pictures = document.createElement("div");
    const imageEdit = document.createElement('img');
    const imageDelete = document.createElement('img');
    const imageAccept = document.createElement('img');
    const inputWhere = document.createElement('input');
    const inputHowMuch = document.createElement('input');

    const parsedDate = new Date(item.data.date);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1; //months from 1-12
    const year = parsedDate.getFullYear();

    imageEdit.onclick = async function () {
      await onEditClickButton(index);
    }

    imageDelete.onclick = async function () {
      await onDeleteClickButton(item.data._id, index);
    }

    imageAccept.onclick = async function () {
      await onAcceptClickButton(item.data._id, index);
    }

    const classNames = [
      "accounting", "number-name", "date", "pictures-edit", "inputWhere", "inputHowMuch", "image", "image", "image"
    ];
    const elements = [accounting, where, date, pictures, inputWhere, inputHowMuch, imageEdit, imageDelete, imageAccept]

    for(let i = 0; i < classNames.length; i++) {
      setClassName(elements[i], classNames[i]);
    }

    inputWhere.type = "text";
    inputHowMuch.type = "number";

    imageEdit.src = "images/pencil-red-eraser-removebg-preview.png";
    imageDelete.src = "images/cross-removebg-preview.png";
    imageAccept.src = "images/greenCheckTransparent.png";

    inputWhere.id = `input-where-${index}`;
    inputHowMuch.id = `input-how-much-${index}`;

    whereValue.innerText = `${index + 1}) ${item.data.where}`;
    dateValue.innerText = `${day}.${month}.${year}`;
    howMuchValue.innerText = item.data.howMuch;

    inputWhere.value = item.data.where;
    inputHowMuch.value = item.data.howMuch;

    if(item.isVisibleCheck) {
      whereValue.style.display = "none";
      howMuchValue.style.display = "none";
      imageEdit.style.display = "none";
    } else {
      inputWhere.style.display = "none";
      inputHowMuch.style.display = "none";
      imageAccept.style.display = "none";
    }

    const parents = [where, where, howMuch, howMuch, pictures, pictures, pictures, date];
    const children = [whereValue, inputWhere, inputHowMuch, howMuchValue, imageAccept, imageDelete, imageEdit, dateValue];

    for(let i = 0; i < parents.length; i++) {
      appendKid(parents[i], children[i]);
    }

    accounting.appendChild(where);
    accounting.appendChild(date);
    accounting.appendChild(howMuch);
    accounting.appendChild(pictures);

    content.appendChild(accounting);

    sumValue += +item.data.howMuch;
  });

  const summary = document.createElement('p');
  const sumValueP = document.createElement('p');
  const dot = document.createElement('p');

  summary.innerText = "Итого: ";
  sumValueP.innerText = sumValue;
  dot.innerText = " р.";

  sumValueP.style.marginLeft = "10px";
  sumValueP.style.marginRight = "10px";

  sum.appendChild(summary);
  sum.appendChild(sumValueP);
  sum.appendChild(dot);
}

const onAddClickButton = async () => {
  const response = await fetch("http://localhost:8000/createAccountings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
        where: document.querySelector("#where-accounting").value,
        date: new Date(),
        howMuch: document.querySelector("#how-much-accounting").value
    })
  });

  const result = await response.json();

  allAccountings.push({
    data: result.data,
    isVisibleCheck: false
  });

  render();
}

const onDeleteClickButton = async (id, index) => {
  const response = await fetch("http://localhost:8000/deleteAccounting", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      id: id
    })
  });

  const result = await response.json();

  if(result.data === "deleted") {
    allAccountings.splice(index, 1);
  }

  render();
}

const onAcceptClickButton = async (id, index) => {
  const inputWhere = document.getElementById(`input-where-${index}`);
  const inputHowMuch = document.getElementById(`input-how-much-${index}`);

  const response = await fetch("http://localhost:8000/changeAccounting", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      id: id,
      data: {
        where: inputWhere.value,
        howMuch: inputHowMuch.value
      }
    })
  });

  const result = await response.json();

  if(result.data === "changed") {
    allAccountings[index].data.where = inputWhere.value;
    allAccountings[index].data.howMuch = inputHowMuch.value;
    allAccountings[index].isVisibleCheck = false;
  }

  render();
}

const onEditClickButton = async (index) => {
  allAccountings[index].isVisibleCheck = true;
  render();
}
