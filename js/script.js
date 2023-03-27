
var apiEndpoint = "https://en.wikipedia.org/w/api.php";
var params = "?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*";
var out_json
var people_list
var Npeople = 10
var first_n = 200


var random_array_item = function (arr, last_index = null) {
  if (length == null) {
    last_index = arr.length
  }
  if (last_index > arr.length) {
    last_index = arr.length
  }
  return arr[last_index * Math.random() << 0];
};

async function get_people(people_list) {
  return await $.ajax({
    url: "files/" + people_list,
    mimeType: "json",
  });
}

async function get_wiki_blurb(article_name) {
  encoded_article_name = encodeURI(article_name)
  title = `&titles=${encoded_article_name}`
  return await $.ajax({
    url: apiEndpoint + params + title,
    mimeType: "json",
  });
};

function add_person(article_name) {
  get_wiki_blurb(article_name).then((value) => {
    wiki_page = value["query"]["pages"]
    pageid = Object.keys(wiki_page)[0]
    page_name = wiki_page[pageid]["title"]
    blurb = wiki_page[pageid]["extract"]
    sliced_blurb = blurb.slice(0, Math.min(240, blurb.length)) + "..."
    wiki_link = "https://en.wikipedia.org/wiki/" + page_name
    $(".liste").append(`<li><a href="${wiki_link}" target="_blank">${page_name}</a></li><p>${sliced_blurb}</p>`)
  });
}

function fill_list_with_people(Npeople) {

  $(".liste").empty()
  get_people(people_list).then((value) => {
    for (let iii = 0; iii < Npeople; iii++) {
      add_person(random_array_item(value, first_n))
    }
  });
};

function change_liste(liste_name) {
  people_list = liste_name
  $("#current-liste").html(people_list)
}

function set_buttons() {
  $("#frch").click(function () {
    change_liste($("#frch").data("url"))
  })
  $("#rest").click(function () {
    change_liste($("#rest").data("url"))
  })
  $("#reload").click(function () { fill_list_with_people(Npeople) })
  set_number_field()
}

function set_number_field() {
  $("#first-n").on("input", function (e) {
    var input = $(this);
    var val = input.val();

    if (input.data("lastval") != val) {
      input.data("lastval", val);
      first_n = val
    }

  });
}

document.addEventListener('DOMContentLoaded', (event) => {
  change_liste("all_time_famous.json")
  set_buttons()
  fill_list_with_people(Npeople)
});