var toDoInps = document.getElementById(`todoInp`);
var dateInps = document.getElementById(`dateInp`);
var secImp = document.getElementById(`importance`);
var secStatus = document.getElementById(`status`);
var typeInps = document.getElementById(`typeInp`);
var deleteIcon = document.getElementsByClassName("delete-box");

var arrayRender = [];
async function addItem() {
  await db
    .collection("todo-items")
    .add({
      toDo: toDoInps.value,
      Date: dateInps.value,
      Importance: secImp.value,
      Status: secStatus.value,
      type: typeInps.value,
    })
    .then((docRef) => {
      arrayRender.push({
        todo: toDoInps.value,
        Date: dateInps.value,
        Importance: secImp.value,
        Status: secStatus.value,
        type: typeInps.value,
      });

      // console.log("Document written with ID: ", docRef.id);
      for (let i = 0; i <= arrayRender.length; i++) {
        var newLi = document.createElement("li");
        newLi.setAttribute("id", `${docRef.id}`);

        var oList = render(
          arrayRender[0].todo,
          arrayRender[0].Date,
          arrayRender[0].Importance,
          arrayRender[0].Status,
          docRef.id,
          arrayRender[0].type
        );
        newLi.innerHTML = oList.trim();
        document.getElementsByClassName("todoUl")[0].appendChild(newLi);

        arrayRender = [];
      }
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  closeModal();
}

var array = [];
async function getItems() {
  await db
    .collection("todo-items")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        array.push({
          id: doc.id,
          todo: doc.data().toDo,
          Date: doc.data().Date,
          Importance: doc.data().Importance,
          Status: doc.data().Status,
          type: doc.data().type,
        });
        // console.log(doc.id, " => ", doc.data()); burda id karsısında bilgileri pushluyor.
      });
      for (let i = 0; i < array.length; i++) {
        var newLi = document.createElement("li");
        newLi.setAttribute("id", `${querySnapshot.docs[i].id}`);

        var oList = render(
          array[i].todo,
          array[i].Date,
          array[i].Importance,
          array[i].Status,
          querySnapshot.docs[i].id,
          array[i].type
        );
        newLi.innerHTML = oList.trim();
        document.getElementsByClassName("todoUl")[0].appendChild(newLi);
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
getItems();

function render(yapilacak, tarih, önem, durum, id, tip) {
  var newFormatDate = formatDate(tarih);

  var oList = `
        
        <div class="todo-box">
          <div onclick="iconWithDelete('${id}')" class="tick-icon mid">
          <div  class="checkIconBox">
          <i onclick="bcg('${id}')" id="checkk" style="font-size: 14px;"class="fa-sharp fa-solid fa-check"></i>
          </div>
          </div>
          <div class="types mid">${tip}</div>
          <div class="articles mid">${yapilacak}</div>
          
          <div class="importanceWrite mid  ">
            <div class="downImportance mid ${önem}">${önem}</div>
          </div>
          <div class="statusWrite mid ">
            <div class="downStatus mid ${durum}">${durum}</div>
          </div>
          <div class="date-box mid">${newFormatDate}</div>
          
          <div class=" edit-box mid">
        <div onclick="editModal('${id}')" class="editIconn">
        <i class="fa-solid fa-user-pen"></i>
      </div>
          </div>
        </div>
        `;
  return oList;
}

function formatDate(tarih) {
  let oldDate = tarih.trim();
  // 2023-12-02

  let newDate = `${oldDate[8]}${oldDate[9]}/${oldDate[5]}${oldDate[6]}/${oldDate[0]}${oldDate[1]}${oldDate[2]}${oldDate[3]}`;
  return newDate;
  
}

function deleteItem(id) {
  db.collection("todo-items")
    .doc(`${id}`)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  document.getElementById(`${id}`).style.display = "none";
}

function editModal(id) {

  toDoInps.value = document
    .getElementById(id)
    .getElementsByClassName("articles")[0].innerHTML;
  dateInps.value = document
    .getElementById(id)
    .getElementsByClassName("date-box")[0].innerHTML;
  secImp.value = document
    .getElementById(id)
    .getElementsByClassName("downImportance")[0].innerHTML;
  secStatus.value = document
    .getElementById(id)
    .getElementsByClassName("downStatus")[0].innerHTML;
  typeInps.value = document
    .getElementById(id)
    .getElementsByClassName("types")[0].innerHTML;

  document.getElementById("addBtn").innerHTML = "SAVE";
  document.getElementById("addBtn").removeAttribute("onclick");
  document
    .getElementById("addBtn")
    .setAttribute("onclick", `editItem('${id}')`);


    for (let i = 0; i < array.length; i++) {
      document.getElementsByClassName('editIconn')[i].classList.toggle('opacityOne');
    }
    document.getElementsByClassName('editPiece')[0].classList.toggle('opacityOne');

  openModal();
}

async function editItem(id) {
  console.log(`${id}`);
  await db.collection("todo-items").doc(id).update({
    toDo: toDoInps.value,
    Date: dateInps.value,
    Importance: secImp.value,
    Status: secStatus.value,
  });

  let newDate = formatDate(dateInps.value);

  document.getElementById("addBtn").innerHTML = "ADD";

  document.getElementById(id).getElementsByClassName("articles")[0].innerHTML =
    toDoInps.value;
  document.getElementById(id).getElementsByClassName("date-box")[0].innerHTML =
    newDate;
  document
    .getElementById(id)
    .getElementsByClassName("downImportance")[0].innerHTML = secImp.value;
  document
    .getElementById(id)
    .getElementsByClassName("downStatus")[0].innerHTML = secStatus.value;
    document
    .getElementById(id)
    .getElementsByClassName("types")[0].innerHTML=typeInps.value ;
    
  closeModal();
}

function openModal() {
  document.getElementsByClassName("modal")[0].style.display = "block";
}

function closeModal() {
  document.getElementsByClassName("modal")[0].style.display = "none";
  document.getElementById("addBtn").innerHTML = "ADD";
  document.getElementById("addBtn").setAttribute("onclick", "addItem()");
}

function searchFunc() {
  let input, filter, card, title, i, txtValue, titleLi;
  input = document.getElementById("searchInp");
  filter = input.value.toLowerCase();
  // card = document.getElementsByClassName("card-container");
  title = document.getElementsByClassName("articles");
  for (i = 0; i < array.length; i++) {
    if (!title[i].innerHTML.toLowerCase().includes(filter)) {
      title[i].parentNode.parentNode.style.display = "none";
    } else {
      title[i].parentNode.parentNode.style.display = "block";
    }
  }
}

var arrDelete = [];
function iconWithDelete(id) {
  arrDelete.push(id);

  document.getElementsByClassName("addTodo")[0].innerHTML = "DELETE";
  document.getElementsByClassName("addTodo")[0].fontSize = "25px";
  document.getElementsByClassName("addTodo")[0].style.backgroundColor = "red";
  document.getElementsByClassName("addTodo")[0].id = "topDelete";

  document.getElementById("topDelete").removeAttribute("onclick");
  document.getElementById("topDelete").setAttribute("onclick", "topluSil()");
}

function topluSil() {
  for (let i = 0; i < arrDelete.length; i++) {
    // db.collection("todo-items")
    //   .doc(`${i}`)
    //   .delete()
    //   .then(() => {
    //     console.log("Document successfully deleted!");
    //   })
    //   .catch((error) => {
    //     console.error("Error removing document: ", error);
    //   });
    // document.getElementById(`${i}`).style.display = "none";
    deleteItem(arrDelete[i]);
  }
  document.getElementsByClassName("addTodo")[0].innerHTML = "+ ADD";
  document.getElementsByClassName("addTodo")[0].style.backgroundColor = "blue";
  document.getElementById("topDelete").setAttribute("onclick", "openModal()");
}

function bcg(id){
  document.getElementById(`${id}`).getElementsByClassName('checkIconBox')[0].classList.toggle('background');
}

function editKey(){
  document.getElementsByClassName('editTodo')[0].classList.toggle('background');
  document.getElementsByClassName('editPiece')[0].classList.toggle('opacityOne');
  for (let i = 0; i < array.length; i++) {
    document.getElementsByClassName('editIconn')[i].classList.toggle('opacityOne');
  }
}
