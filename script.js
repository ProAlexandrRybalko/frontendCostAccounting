let allAccountings = [];


window.onload = async function () {
  const response = await fetch("http://localhost:8000/allAccountings", {
    method: "GET"
  });

  const result = await response.json();

  let i = 0;
  while (i < result.data.length) {
    allAccountings.push({
      data: result.data[i],
      isVisibleCheck: false
    });

    i++;
  }

  render();
}

const render = () => {
  const content = document.getElementById('view-accounting');

  while (content.firstChild) {
    content.removeChild(content.firstChild);
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

    accounting.className = "accounting";
    where.className = "number-name";
    date.className = "date";
    pictures.className = "pictures-edit";
    inputWhere.className = "inputWhere";
    inputHowMuch.className = "inputHowMuch";

    imageEdit.src = "images/pencil-red-eraser-removebg-preview.png";
    imageEdit.style.width = "40px";
    imageEdit.style.height = "40px";
    imageEdit.style.cursor = "pointer";



    imageDelete.src = "images/cross-removebg-preview.png";
    imageDelete.style.width = "40px";
    imageDelete.style.height = "40px";
    imageDelete.style.cursor = "pointer";

    imageDelete.onclick = async function () {
      await onDeleteClickButton(item.data._id, index);
    }

    imageAccept.src = "images/greenCheckTransparent.png";
    imageAccept.style.width = "40px";
    imageAccept.style.height = "40px";
    imageAccept.style.cursor = "pointer";

    where.id = `number-name-${index}`;
    date.id = `date-${index}`;
    howMuch.id = `value-${index}`;

    const parsedDate = new Date(item.data.date);

    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1; //months from 1-12
    const year = parsedDate.getFullYear();

    whereValue.innerText = `${index + 1}) ${item.data.where}`;
    dateValue.innerText = `${day}.${month}.${year}`;
    howMuchValue.innerText = item.data.howMuch;

    if(item.isVisibleCheck) {
      inputWhere.value = item.data.where;
      where.appendChild(inputWhere);
      inputWhere.value = item.data.howMuch;
      howMuch.appendChild(inputHowMuch);
      pictures.appendChild(imageAccept);

    } else {
      where.appendChild(whereValue);
      howMuch.appendChild(howMuchValue);
      pictures.appendChild(imageEdit);
    }

    pictures.appendChild(imageDelete);
    date.appendChild(dateValue);

    accounting.appendChild(where);
    accounting.appendChild(date);
    accounting.appendChild(howMuch);
    accounting.appendChild(pictures);

    content.appendChild(accounting);
  });
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
