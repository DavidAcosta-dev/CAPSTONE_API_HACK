'use strict';

function toggleIngredientsInfo(){
    $('main').on('click', '.icon-badges', e=> {
        e.stopPropagation();
        console.log(e.target);
        let badgeName = $(e.target).attr('id');
        console.log(badgeName);
        $(e.target).toggleClass('expanded');
        $('#word-bubble').toggleClass('hidden');
        $('#word-bubble').text(badgeName);

    })
}

function appendInstructionsToImage(instructions){
    console.log(instructions[0].steps);
    let steps = instructions[0].steps;
    let stepsHtml = [];
    steps.map(step=> {
        stepsHtml.push(`<li><h4>Step#${step.number}:</h4><p>"${step.step}"</p></li>`);
    })

    return `<ul>${stepsHtml.join('')}</ul>`

}

function toggleRecipieInstructions(){ //The soul purpose of this is to unhide/hide the drop-down instructions div that is already there
    $('main').on('click', '.recipie-toggle-button', e=> {
        console.log(e.target);
        let instructions = $(e.target).find('ul');
        console.log(instructions);
        instructions.toggleClass('hidden');
        $(e.target).toggleClass('expanded');
        $(e.target).find('input').toggleClass('expanded');

    })
}

function clickImageFetchRecipie(){ //***This calls the 2nd api fetch for an individual recepie once image is clicked on.
    $('main').on('click', '.recipie-fetch-layer', e=> {
        e.stopPropagation();
        console.log(e.target);
        $(e.target).removeClass('recipie-fetch-layer');
        $(e.target).addClass('recipie-toggle-button');
        $(e.target).addClass('expanded');
        $(e.target).find('input').addClass('expanded');
        
        console.log(e.target);
        let recepieId = $(e.target).attr('id');
        console.log(recepieId);

        fetch(`https://api.spoonacular.com/recipes/${recepieId}/analyzedInstructions?stepBreakdown=true&apiKey=${ghostKey}`)
        .then(res=> {
            if(res.ok){
                return res.json();
            }
            throw new Error(res.statusText);
        })
        .then(resJson=> {
            console.log(resJson);
            $(`#${recepieId}`).append(appendInstructionsToImage(resJson))
        })
        .catch(err => {
            console.log(err.message);
        })





    })
}

function displayRecipies(res){
    let allRecepiesHtml = [];
    STORE.recipieList.map(rec=> {
        let usedBadges = rec.usedIngredients.map(ing=> `<img id="${ing.name}" class="icon-badges used" src="${ing.image}">`).join("");
        let missedBadges = rec.missedIngredients.map(ing=> `<img id="${ing.name}" class="icon-badges missed" src="${ing.image}">`).join("");
        let usedingredients = rec.usedIngredients.map(ing=> `<li>* ${ing.originalString}</li>`).join("");
        let missedIngredients = rec.missedIngredients.map(ing=> `<li>* ${ing.originalString}</li>`).join("");
        
        allRecepiesHtml.push(`<div id="${rec.id}" class="recepie-div recipie-fetch-layer">
        <span class="like-span"><img class="icon-like" src="images/like.png"> Likes: ${rec.likes}</span>
        <h3>${rec.title}</h3>
        <div id="word-bubble" class="hidden"></div>
        <div class="ingredient-badges-box">${usedBadges}${missedBadges}</div>
        <input class="recipie-image" type="image" src="${rec.image}">
        <div class="req-ing-title-div">
        <h4 class="req-ing-title-h4">Required Ingredients</h4>
        </div>
        <ul class="required-ingredients">${usedingredients}${missedIngredients}</ul>
        </div>`) 
    });
    return allRecepiesHtml.join('');
}

function renderList(list){
    console.log('renderList called...')
    $('.ingredients-list-div').show();
    let ingList = []
    
    list.map(itm=> {
        ingList.push(`<li class="ingredient ${itm}"><h3>${itm}</h3><button class="delete-${itm}" type="button">Delete</button></li>`)
    })

    console.log(ingList);

    $('.js-recepies-ul').html(ingList.join(""));
    
}

function addToList(ing){
    STORE.list.push(ing);
    console.log(STORE.list);
    renderList(STORE.list);
}

function watchForm(){
    console.log('watchForm standing by...');

    $('#js-form').on('submit', e=> {
        e.preventDefault();
        console.log('ingredient submitted');
        let ingredient = $('#ingredient').val();
        console.log(ingredient);
        addToList(ingredient);
        $('#ingredient').val("");

    })
}

function getRecepies(){
    $('#js-show-recepies-button').on('click', e=> {
        console.log("So this is what the ingredient string looks like..."+ STORE.list.join(','));
        console.log(STORE.list);

        let url = STORE.baseUrl + `apiKey=${ghostKey}&ingredients=${encodeURIComponent(STORE.list.join(','))}`;

        console.log(url);

        fetch(url)
        .then(res=> {
            if(res.ok){
                return res.json();
            }
            throw new Error(res.statusText);
        })
        .then(resJson=> {
            console.log(resJson);
            resJson.map(recipie=> {
                STORE.recipieList.push(recipie);
            })
            $('.ingredients-list-div').hide();
            $('.recepie-display').show();
            $('.recepie-box').html(displayRecipies(resJson));
        })
        .catch(err=> {
            console.log(err.message);
        })

        

    })
    
}

function handleApp(){
    console.log('DOM loaded...app ready.');
    watchForm();
    getRecepies();
    clickImageFetchRecipie();
    toggleRecipieInstructions();
    toggleIngredientsInfo();
}

$(handleApp);