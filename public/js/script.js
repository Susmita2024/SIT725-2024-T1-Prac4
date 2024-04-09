const submitForm = async () => {
  let formData = {};
  formData.title = $('#title').val();
  formData.color = $('#color').val();
  formData.imagePath = $('#image_path').val();
  formData.description = $('#description').val();

  const errors = await validateNewCard(formData);
  if (errors.length !== 0) {
    alert(`Invalid input!\n${errors}`);
    throw new Error(errors);
  }

  // make api call
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        alert('Card posted succefully');
        // clear input so that when the modal renders next time, it won't show current data
        document.getElementById('modal1').style.display = 'none';
        document.getElementById('title').value = '';
        document.getElementById('color').value = '';
        document.getElementById('image_path').value = '';
        document.getElementById('description').value = '';
      } else {
        console.log('Failed to post card!');
      }
    }
  }

  xhr.open("POST", "http://localhost:3000/api/cards", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    value: formData
  }));
}


const validateNewCard = async (card) => {
  errors = [];
  if (!card) {
    errors.push('Invalid card')
  } else {
    if (!card.title || card.title.trim() === '') {
      errors.push('Invalid title');
    }
    if (!card.color || card.color.trim() === '') {
      errors.push('Invalid color');
    }
    const validUrl = await isValidUrl(card.imagePath);
    if (!validUrl) {
      errors.push('Invalid imagePath');
    }
    if (!card.description || card.description.trim() === '') {
      errors.push('Invalid description');
    }
  }
  return errors;
}

const isValidUrl = async (url) => {
  if (!url || url.trim() === '') {
    return false;
  }
  try {
    const response = await fetch(url);
    // console.log(response);
    return response !== null && response.status === 200;
  } catch (error) {
    return false;
  }

}


const addCards = (items) => {
  // console.log(items);
  items.forEach(item => {
    let itemToAppend =
      `
        <div class="col s4 center-align">
          <div class="card medium">
            <div class="card-image waves-effect waves-block waves-light">
              <img class="activator" src="${item.imagePath}" alt="dog">
            </div>
            <div class="card-content">
              <span class="card-title activator grey-text text-darken-4">Dog<i
                  class="material-icons right">more_vert</i></span>
              <p><a href="#">${item.link}</a></p>
            </div>
            <div class="card-reveal">
              <span class="card-title grey-text text-darken-4">Dog<i class="material-icons right">close</i></span>
              <p class="card-text">${item.description}</p>
            </div>
          </div>
        </div>
      `;
    $("#card-section").append(itemToAppend)
  });
}



const fetchCards = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/cards');
    let cards = await response.json();
    cards.forEach(card => card.link = `About ${card.title}`);
    return cards;
  } catch (error) {
    console.error(`failed to fetch cards; error: ${error}`);
  }
}

$(document).ready(async function () {
  $('.materialboxed').materialbox();
  $('#formSubmit').click(() => {
    submitForm();
  })
  const cards = await fetchCards();
  console.log(cards);
  addCards(cards);
  $('.modal').modal();
});