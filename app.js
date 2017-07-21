$(document).ready(function() {

 var ingredArr = [];
 $('#add-ingredient').click(function() {
    var currIngred = $('#ingredient-input').val();
    var ingredBox = $(`<button class="added-ingredient"><span class="ingredient">${currIngred}</span><i class="fa fa-times delete-ingredient" aria-hidden="true"></i></button>`);
    if (currIngred) {
      ingredArr.push(currIngred);
      $('#ingredient-input').val('');
      $('.ingredient-container').append(ingredBox);
    }

    $('.delete-ingredient').click(function(e) {
      $(this).parent().remove();
      var ingredToRemove = $(this).siblings()[0].innerHTML;
      ingredArr = ingredArr.filter(function(val) {
        return val !== ingredToRemove
      })
    })
 })



  $(document).ajaxStart(function() {
    $('.tohide').hide();
    $("#loading").show();
  });

  $(document).ajaxStop(function() {
    $("#loading").hide();
  });



 $('#submit-ingredients').click(function(e){
   e.preventDefault();
   var query = ingredArr.join('%2C')
   var url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${query}&limitLicense=false&number=20&ranking=2`
   $.ajax({
     url: url,
     type: 'GET',
     data: {},
     dataType: 'json',
     success: function(result) {
       $('.search-container').empty();
       $('#search-h2').velocity('slideUp', {duration: 400, transition: "easeOut"});
       $('.results-header').show().velocity('slideDown', {duration: 400, transition: "easeIn"});

       var counter = 0;

         for (var item of result) {

           var recipeUrl = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${item.id}/information`;
           $.ajax({
             url: recipeUrl,
             type: 'GET',
             data: {},
             dataType: 'json',
             success: function(data) {



              function search() {
                // CREATING ARRAY OF INGREDIENTS
                var ingredientArr = [];
                for (var ingredient of data.extendedIngredients) {
                  ingredientArr.push(ingredient.name);
                }
                var ingredientList = ingredientArr.join(", ")

                // APPENDING EACH RECIPE
                 $('.search-container').append(
                   `<div class="col-md-12 recipe-result">
                     <div class="col-md-4 image">
                       <div class="img" style="background: url('${data.image}') no-repeat center center"></div>
                     </div>
                     <div class="col-md-8 info">
                       <h2>${data.title}</h2>
                       <p id="ingredient-list"><b>Ingredients:</b><br>${ingredientList}</p>
                       <div class="bottom-info">
                        <p>Servings: ${data.servings}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Time: ${data.readyInMinutes} min</p>
                        <button type="button" class="view-recipe"><i class="fa fa-angle-right" aria-hidden="true"></i></button>
                       </div>
                     </div>
                   </div>
                   <hr>`
                 ).css('padding-top', '8%');




                // VIEW RECIPE BUTTON FUNCTIONALITY
                var btn = $('.view-recipe');
                $(btn[counter]).click(function() {

                  var instructionArr;
                  if (data.instructions === "Instructions") {
                    instructionArr = "none";
                  } else if (data.instructions) {
                    instructionArr = data.instructions.split(".");
                  } else {
                    instructionArr = "none";
                  }

                  var instructionsHTML = [];

                  if (instructionArr === "none") {
                   instructionsHTML.push('<p>Check source for instructions.</p>')
                 } else {
                   for (var each of instructionArr) {
                     if (each) {
                       instructionsHTML.push(`<li>${each}</li>`)
                     }
                   }
                 }


                 var newInstructions = instructionsHTML.join("");


                 // APPENDING RECIPE TO POPUP
                 $('.cover').empty()
                 $('.cover').append(
                   `<div class="col-md-6 col-md-offset-3 recipe-popup">
                     <i class="fa fa-times close-recipe" aria-hidden="true"></i>
                     <a href="${data.sourceUrl}" target="_blank"><button type="button" class="source-link">VIEW SOURCE</button></a>
                     <div class="col-md-5 left">
                       <div class="recipe-img" style="background: url('${data.image}') no-repeat center center"></div>
                       <div class="recipe-specs">
                         <h2>${data.title}</h2>
                         <p><b>Servings:</b> ${data.servings}<br><b>Time:</b> ${data.readyInMinutes} min</p>
                         <hr />
                       </div>
                     </div>
                     <div class="col-md-7 right">
                       <h3>Instructions:</h3>
                         <ol class="instructions">${newInstructions}</ol>
                     </div>
                   </div>`
                 )

                  $('.cover').show();

                  $('.close-recipe').click(function() {
                    $('.cover').hide();
                  })



                  // $(document).click(function(e) {
                  //   if (!e.target.closest('.recipe-popup').length) {
                  //     if($('.recipe-popup').is(":visible")) {
                  //       $('.cover').hide();
                  //     }
                  //   }
                  // })
                });
                counter++;


              }

              search();


             },
             error: function(err) { console.log(err); },
             beforeSend: function(xhr) {
               xhr.setRequestHeader('X-Mashape-Authorization', 'Z0aD9osDoWmshDHGgah1NFoas6gEp1s1hLyjsnieMIje34jGMZ');
             }
           });

         }







       $('.results-header').show();

     },
     error: function(err) { console.log(err); },
     beforeSend: function(xhr) {
       xhr.setRequestHeader('X-Mashape-Authorization', 'Z0aD9osDoWmshDHGgah1NFoas6gEp1s1hLyjsnieMIje34jGMZ');
     }
   });
 })



})
