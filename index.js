'use strict';

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
        console.log(STORE.list)

        

    })
    
}

function handleApp(){
    console.log('DOM loaded...app ready.');
    watchForm();
    getRecepies();
}

$(handleApp);