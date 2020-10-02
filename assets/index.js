//the $(function()) that wraps all of the below things is a jquery function onload. This is mainly for the the first get request to append the submitted files onto the list onload instead of needing to make a button to make a get request
$(function () {
  //this is just getting the readdir get request at the bottom of my node backend app.js
  //have to copy in the <a> tag stuff in here as well as it wouldn't have worked to update just the newly appended stuff, have to update whats already existing as well
  $.get("/names", function (data) {
    //   console.log(data)
    $("#submittedFiles").append(
      data.map((value) => `<div><a class="list-group-item list-group-item-action" href='/uploads/${value}'>${value}</a></div>`)
    );
  });
  //had massive issues with this submit compared to what i was doing before, but wanted to do it this way as before i had a res.redirect('back') in my node POST request and e.preventDefault would be a better way of doing it. If I did not have corbs there to help me I wouldn't have been able to figure out the solutions on my own and probably just kept my old methods
  //few main things to note here, one is the files path, it took a long time to find the path into the actual files
  //another is processData and contentType, which was necessary because it kept sending back a file too big error and invalid content. As far as i understand it shouldn't have an issue anyways, but throws up an error because its expecting a normal element like a string but getting a file much bigger
  $("#form").on("submit", (event) => {
    event.preventDefault();
    console.log("going to POST");
    let fd = new FormData();
    let files = $("#myFile")[0].files[0];
    fd.append("file", files);

    $.ajax({
      url: "/data",
      method: "POST",
      data: fd,
      // data: $("#form").serialize(), this is just an alternative way to post the data, as a JSON.
      processData: false,
      contentType: false,
      //this success is just taking the res.send(name) from the node POST request as data, and appending it to the list. Much cleaner way than what I was doing before, which was using the get request at the bottom of my node backend app.js and making another get request in this frontend js
      //need to remember that any changes i want to make to the data that comes in i HAVE to do in the success.
      //i was trying to do this in a very roundabout way where i'd make the list onclick outside this success, but corbs reminded me i could just make it an <a> tag and it would work fine.
      //also put in the other way of doing it and cleaned it up, which would work fine too, much better than my old way
      success: (data) => {
        // console.log(data)
        $("#submittedFiles").append(
          `<div><a class="list-group-item list-group-item-action" href='/uploads/${data}'>${data}</a></div>`
        );
        // $('#submittedFiles').append(`<li onClick='download(${data}')>${data}</li>`)
      },
    });
  });
});

//this is just for the alt way of getting the download on click
// const download = name => {
//     $.get(`/uploads/${name}`)
// }


/*TODO- if I have time later/ can be bothered

- if the same files are sent in they get appended onto the download list, even though there is already one existing there- can do this by making an if statement to wrap everything above in, if data is there don't post, if not then post

- consider changing the download button to a download box to be able to drop files into- instead of submit form have a div that wraps the download files div (or just use the container there) and make a on drop function

- consider adding a delete button- have to make an ajax delete request and node delete request
 */