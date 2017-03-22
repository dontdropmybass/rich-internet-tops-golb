var blogposts;
var sortBy = "createdOn";
var order = "ASC";
function edit(i) {
    $("#edit-modal").modal('open');
    $("#edit-body").val(blogposts[i].body);
    $("#edit-title").val(blogposts[i].title);
    $("#edit-save").click(function() {
        if ($("#edit-title").val()==""||$("#edit-body").val()=="") {
            Materialize.toast("Make sure all your fields have text in them!", 4000);
        }
        else {
            var post = blogposts[i];
            post.body = $("#edit-body").val();
            post.title = $("#edit-title").val();
            $("#edit-modal").modal("close");
            $("#spinner").show();
            $.when(
                $.ajax({
                    url: "http://localhost:3000/posts/"+post.id,
                    type: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(post)
                })
            )
                .done(function() {
                    $("#spinner").hide();
                    loadBlogPosts();
                })
                .fail(function(e) {
                    $("#edit-fail-reason").text("Edit failed.");
                    console.log(e);
                    $("#edit-failed").modal('open');
                    $("#spinner").hide();
                });
        }

    });
    $("#edit-delete").click(function() {
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
    });
    Materialize.updateTextFields();
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
                                        "<div class='chip right'>Created on: "+
                                            data[i].createdOn+
                                        "</div>"+
                                    "</span>"+
                                    "<a onclick='edit("+i+")' class='btn-floating halfway-fab waves-effect waves-light orange'><i class='material-icons'>edit</i></a>"+
                                    "<p>"+data[i].body+"</p>"+
                                "</div>"+
                            "</div>"+
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
    Materialize.updateTextFields();
}

function saveNew() {
    if ($("#add-body").val()==""||$("#add-title").val()=="") {
        Materialize.toast("Make sure all your fields have text in them!", 4000);
    }
    else {
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

    $("#new-button").click(function() {
        $("#add").modal('open');
        Materialize.updateTextFields();
    });

    $("#save-new").click(function() {
        saveNew();
    });

    $(".button-collapse").click(function() {
        $("#add").modal('open');
        Materialize.updateTextFields();
    });
});