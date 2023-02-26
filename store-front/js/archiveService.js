const startSection = (counter, element) =>{
    return `
    <!--section-->
    <div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne">
        <button class="accordion-button collapsed archive__date__header font_Comfortaa" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseOne${counter}" aria-expanded="false" aria-controls="flush-collapseOne${counter}">
            ${element.created}
        </button>
    </h2>

    <div id="flush-collapseOne${counter}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
    <div class="accordion-body">

    <!--archive-body-start-->
    <div class="container">
    <div class="row archive__list_item">
    <div class="col-12 col-md-12 archive__container__margin">
    
        <!--Order details-->
        <table class="table">
        <tbody class="align-middle text-center">
    `;
}

const createPosition = (counter,element) =>{
    return `
    <!--item-->
    <tr>
        <td rowspan="2"><img src="/img/book/book_${element.book_id}.png" class="archive__item__image"></td>
        <td>${element.book.name}</td>
        <td>${element.price}</td>
        <td rowspan="2" class="fw-bolder">${(element.number*element.price).toFixed(2)}</td>   
    </tr>
    <tr>
        <td>${element.book.author}</td>
        <td>${element.number}</td>
    </tr>
    `;
}

const endSection = () =>{
    return `
        </tbody>
        </table>
    </div></div></div>
    <!--archive-body-end-->
    </div></div></div>
    `;
}


const renderArchive = async () => {
    customerId = parseInt(sessionStorage.getItem("userId"));    
    const response = await fetch("http://localhost:8080/api/v2/archive/group/"+customerId);
    const data = await response.json();
    
    var counter=1;
    var allArchive="";


    var testDate=data[0].created;
    console.log(testDate);

    var firstTime=true;
    var sectionEnd=false;

    Object.values(data)?.forEach(element => {
        var textElement="";

        if(firstTime){
            //textElement+="<hr>";

            textElement += startSection(counter, element);

            firstTime=false;
            sectionEnd=true;
            counter+=1;
        }

        if(testDate!=element.created){
            //textElement+="end";
            //textElement+="<hr>";

            textElement += endSection();
            textElement += startSection(counter, element);

            sectionEnd=true;
            counter+=1;
        }

        textElement += createPosition(counter,element);
                        
        allArchive+=textElement;
        testDate=element.created;
    });
    //allArchive+="end";
    allArchive += endSection();

    //add archive list to website
    document.getElementById("accordionFlushExample").innerHTML=allArchive;
}