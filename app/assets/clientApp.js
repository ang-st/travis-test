//var bla = function

function storeObject(name,obj){
  console.log("storeObject: ",obj)
  localStorage.setItem(name,JSON.stringify(obj))

}
function loadObject(name){
  return JSON.parse(localStorage.getItem(name))
}

function addObject(name, obj){
 var entry = loadObject(name) 
 console.log('add object '+entry)
 if (entry == null ){
  entry = new Array()  
  //storeObject(name,)
 }
  entry.push(obj)
  storeObject(name,entry)
 
}

$(document).ready(function(){
 

// DELETE STORAGE
//localStorage.removeItem("url_ressources")

var row = function(data){
  var htmlobj = "<div> <a href='"+data.url+"'>[ "+data.title+" ]</a>"+
    //" </div>"+ "<div class='presLink'><button value='"+ data.url+"'> launch </button></div>"
     "<button  class='presLink' value='"+data.url+"' > launch </button></div>"
  //return "<div><div>"+data.title+"</div> <div>| "+ data.url+" </div>"+ "<button class='.presLink'value='bla'> launch </button></div>"
   return htmlobj

  }
var export_json = function(){
  
  var csvData = 'data:application/json;charset=utf-8,' + localStorage.getItem(name);

  $(this).attr({
  'href': csvData,
  'target': '_blank'
  });
}

  var browser_ressource = loadObject("url_ressources")
  console.log()
  if (browser_ressource != null && browser_ressource.forEach != null){
    browser_ressource.forEach(function (o,i,l){
      if (o.url){
       $("#ressources_list").append(row(o))
       $(".presLink").click(function(){
          $.post('/set', {url:this.value}, function(data) {console.log("hop")})
      })
    }
       
    })
  }


  $("#addUrl").click(function(){
    console.log("Hey")
    var url=$("#urlText").val()
   $.post("/", {url:url}, function(data){
      console.log(data)
      if (data.url){
        //$("#ressources_list").append("<div> <p>"+data.title +"</p></div>")
        addObject("url_ressources", data)
        $("#ressources_list").append(row(data))
        $(".presLink").click(function(){
          $.post('/set', {url:this.value}, function(data) {console.log("hop")})
        })
      }
    })
  })

  $("#deleteButton").click(function(){
    console.log("delete")
    localStorage.removeItem("url_ressources")
    $("#ressources_list").html("")

  })

  $("#saveButton").click(function(event){
    console.log("save")
   var csvData = 'data:application/json;charset=utf-8,' + localStorage.getItem("url_ressources");

  $(this).attr({
  'href': csvData,
  'target': '_blank'
  });

  })


  })

