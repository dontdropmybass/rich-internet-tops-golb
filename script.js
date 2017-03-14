var blogposts;
var sortBy = "createdOn";
var order = "ASC";
function edit(i) {
    for (var n = 0; n < blogposts.length; n++) {
        if (i!=n) {
            $("#editArea"+n).hide();
        }
    }
    $("#editArea"+i).toggle();
}
function save(i) {
    var post = blogposts[i];
    post.body = $("#body"+i).val();
    post.title = $("#title"+i).val();
    $.when(
        $.ajax({
            url: "http://localhost:3000/posts/"+post.id,
            type: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(post)
        })
    )
    .done(function() {
        loadBlogPosts();
    })
    .fail(function() {
        $("<div class='card card-content'>Failed to update post.</div>");
    });
    $("#editArea"+i).hide();
}
function deletePost(i) {
    $("#delete-modal").modal('open');
    $("#delete-confirm").click( function() {
        $("#spinner").show();
        $.when($.ajax({url: "http://localhost:3000/posts/"+blogposts[i].id, type: "DELETE"}))
            .done(function() {
                $("#spinner").hide();
                $("#editArea"+i).hide();
                loadBlogPosts();
            })
            .fail(function(e) {
                $("#spinner").hide();
                $("#delete-fail-reason").html(e);
                $("#delete-failed").modal("show");
            })
    });
}
function loadBlogPosts() {
    $("#spinner").show();
    $("#blog-posts").hide();
    $.when($.ajax({url: "http://localhost:3000/posts?_sort="+sortBy+"&_order="+order, type: "GET"}))
        .done(function(data) {
            blogposts = data;
            $("#spinner").hide();
            $("#blog-post-area").html("");
            for (var i = 0; i < data.length; i++) {
                $("#blog-post-area").append(
                    "<div class='row'>"+
                        "<div class='col s12'>"+
                            "<div class='card'>"+
                                "<div class='card-content'>"+
                                    "<span class='card-title'>"+
                                        data[i].title+
                                        "<div class='chip'>Created on: "+
                                            data[i].createdOn+
                                        "</div>"+
                                    "</span>"+
                                    "<a onclick='edit("+i+")' class='btn-floating halfway-fab waves-effect waves-light orange'><i class='material-icons'>edit</i></a>"+
                                    "<p>"+data[i].body+"</p>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    "<div id='editArea"+i+"' class='col s12' hidden>"+
                        "<div class='row input-field validate'>"+
                            "<input id='title"+i+"' value='"+data[i].title+"' type='text'/>"+
                            "<label for='title"+i+"' class='active'>Title</label>"+
                        "</div>"+
                        "<div class='row input-field validate'>"+
                            "<textarea id='body"+i+"'>"+data[i].body+"</textarea>"+
                            "<label for='body"+i+"' class='active'>Body</label>"+
                        "</div>"+
                        "<div class='row right'>"+
                            "<a onclick='save("+i+")' class='btn-floating fab waves-effect waves-light green'>"+
                                "<i class='material-icons'>save</i>"+
                            "</a>"+
                            "<a onclick='deletePost("+i+")' class='btn-floating fab waves-effect waves-light red'>"+
                                "<i class='material-icons'>delete</i>"+
                            "</a>"+
                        "</div>"+
                    "</div>"
                );
            }
            $("#blog-posts").show();
        })
        .fail(function(error) {
            $("#spinner").hide();
            $("<div><p>error.message</p></div>").dialog();
        });
}

function saveNew() {
    $("#spinner").show();
    var now = new Date();
    var monthNums = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    var today = now.getFullYear() + "-" + monthNums[now.getMonth()] + "-" + now.getDate();
    var post = {
        "title": $("#add-title").val(),
        "body": $("#add-body").val(),
        "createdOn": today
    };
    $.when($.ajax({
        url: "http://localhost:3000/posts",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(post)
    }))
        .done(function() {
            $("#spinner").hide();
            $("#add").hide();
            loadBlogPosts();
        })
        .fail(function(error) {
            $("#spinner").hide();
            alert(error);
        });

}

$(function () {
    $('select').material_select();
    loadBlogPosts();
    $('select').change(function () {
        sortBy = $("#sortBy").val();
        order = $("#orderBy").val();
        loadBlogPosts();
    });
    $('.modal').modal();
    $("#new-button").click(function(){$("#add").toggle();});
    $("#save-new").click(function(){saveNew();});
});