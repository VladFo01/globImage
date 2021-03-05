document.querySelector('#uploadImage').addEventListener('submit', (e) => {
  e.preventDefault();

  const xhr = new XMLHttpRequest();

  xhr.open('POST', '../create.php', true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        response = xhr.response;
        console.log(response);
      } else {
        console.error('Error code: ', xhr.status);
        console.error('Error message: ', xhr.statusText);
      }
    }
  }

  xhr.send('data');
})