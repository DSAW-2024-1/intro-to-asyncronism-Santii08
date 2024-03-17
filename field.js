// Realiza una solicitud GET a un endpoint de la API para obtener todas las citas
fetch('https://thesimpsonsquoteapi.glitch.me/quotes?count=100')
  .then(response => {
    if (!response.ok) {
      throw new Error('La solicitud no fue exitosa');
    }
    return response.json();
  })
  .then(data => {
    const citaGroups = [];
    for (let i = 0; i < data.length; i += 12) {
      citaGroups.push(data.slice(i, i + 12));
    }
    showCitasPage(citaGroups, 1);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    const textoAPI = document.createElement('p');
    textoAPI.textContent = 'Error al cargar los datos desde la API';
    const citasContainer = document.getElementById('citasContainer');
    citasContainer.appendChild(textoAPI);
  });

function showCitasPage(citaGroups, pageNumber) {
  const citasContainer = document.getElementById('citasContainer');
  citasContainer.innerHTML = '';
  const currentPageCitas = citaGroups[pageNumber - 1];

  currentPageCitas.forEach(quoteData => {
    const characterName = quoteData.character;
    const quoteText = quoteData.quote;
    const imageUrl = quoteData.image;

    const quoteContainer = document.createElement('div');
    quoteContainer.classList.add('col-md-3', 'mb-6', 'border', 'border-dark');

    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = characterName;
    imgElement.classList.add('img-fluid', 'rounded');

    const nameElement = document.createElement('p');
    nameElement.textContent = characterName;
    nameElement.classList.add('font-weight-bold');

    const quoteElement = document.createElement('p');
    quoteElement.textContent = quoteText;

    quoteContainer.appendChild(imgElement);
    quoteContainer.appendChild(nameElement);
    quoteContainer.appendChild(quoteElement);

    citasContainer.appendChild(quoteContainer);
  });

  showPagination(citaGroups, pageNumber);
}

function showPagination(citaGroups, currentPage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  citaGroups.forEach((group, index) => {
    const pageLink = document.createElement('li');
    pageLink.classList.add('page-item');
    const link = document.createElement('a');
    link.classList.add('page-link');
    link.href = '#';
    link.textContent = index + 1;
    link.addEventListener('click', () => {
      showCitasPage(citaGroups, index + 1);
    });
    pageLink.appendChild(link);
    pagination.appendChild(pageLink);
  });

  const currentPageLink = pagination.querySelector(`a:nth-child(${currentPage})`);
  currentPageLink.parentNode.classList.add('active');
}
document.getElementById('characterNameInput').addEventListener('keyup', function(event) {
    // Obtener el valor del campo de entrada
    const characterName = event.target.value.trim();

    // Realizar la solicitud a la API solo si hay al menos un carácter ingresado
    if (characterName.length > 0) {
        fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=15&character=${characterName}`)
            .then(response => response.json())
            .then(data => {
                // Limpiar el contenedor de citas
                document.getElementById('citasContainer').innerHTML = '';

                // Mostrar las citas obtenidas
                data.forEach(quote => {
                    const quoteContainer = document.createElement('div');
                    quoteContainer.classList.add('col-md-4', 'mb-4');

                    const imgElement = document.createElement('img');
                    imgElement.src = quote.image;
                    imgElement.alt = quote.character;
                    imgElement.classList.add('img-fluid', 'rounded');

                    const nameElement = document.createElement('p');
                    nameElement.textContent = quote.character;
                    nameElement.classList.add('font-weight-bold');

                    const quoteElement = document.createElement('p');
                    quoteElement.textContent =quote.quote;

                    quoteContainer.appendChild(imgElement);
                    quoteContainer.appendChild(nameElement);
                    quoteContainer.appendChild(quoteElement);

                    document.getElementById('citasContainer').appendChild(quoteContainer);
                });
            })
            .catch(error => console.error('Error al obtener las citas:', error));
    } else {
        // Limpiar el contenedor de citas si no se ha ingresado ningún carácter
        document.getElementById('citasContainer').innerHTML = '';
    }
});