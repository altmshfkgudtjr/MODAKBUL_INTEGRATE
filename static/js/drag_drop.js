let final_result = [];
let send_data = [];
let board_rank = 0;
let sortable_list = [];
var ACCESS_DENIED_BOARD = ['공지', '갤러리', '학생회소개', '통계', '대외활동', '대외활동_공모전', '대외활동_취업', '투표', '장부'];
let main_list;
let main_sortable;

function M_setting_init_data_first() {
    main_list = document.getElementById('M_sortable_list');
    main_sortable = new Sortable(main_list, {
        group: {
            name: 'M_sortable_list',
            put: false
        },
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
    });
    
    final_result = [];
    send_data = [];
    board_rank = 0;
    sortable_list = [];
    sortable_list.push(main_sortable);
}
/*
let main_list = document.getElementById('M_sortable_list');
let main_sortable = new Sortable(main_list, {
    group: {
        name: 'M_sortable_list',
        put: false
    },
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
});

let final_result = [];
let send_data = [];
let board_rank = 0;
let sortable_list = [];
sortable_list.push(main_sortable);
*/
var ACCESS_DENIED_BOARD = ['공지', '갤러리', '학생회소개', '통계', '대외활동', '대외활동_공모전', '대외활동_취업', '투표', '장부'];


function M_setting_init_data() {
    selected_tags_cnt = 0;
    $('#M_new_board_name').val("");
    $('#M_sortable_list').empty();
    let tag_ajax = A_JAX(TEST_IP+'get_access_tags', 'GET', null, null);
    $.when(tag_ajax).done(function() {
        $('.M_nav_add').empty();
        for (let i=0; i<tag_ajax.responseJSON.tags.length; i++)
        {
            $('.M_nav_add').append('<div onclick="select_tag($(this))" class="M_nav_tag"># ' + tag_ajax.responseJSON.tags[i] + '</div>')
        }
    });

    let ajax = A_JAX(TEST_IP+'get_boards_origin', 'GET', null, null);
    $.when(ajax).done(function () {
        result_html = '';

        let data = ajax.responseJSON.boards;
        let result_list = [];
        let nested_list = [];

        for (let i=0; i<data.length; i++) {
            if (data[i].board_url.split('_')[1] === undefined) result_list.push(data[i]);
            else nested_list.push(data[i]);
        }

        for (let i=0; i<nested_list.length; i++) {
            for (let j=0; j<result_list.length; j++) {
                for (let k=0; k<nested_list[i].board_url.split('_').length; k++) {
                    let check;
                    if (Array.isArray(result_list[j]) === true) {
                        check = result_list[j][0].board_url;
                    }
                    else {
                        check = result_list[j].board_url;
                    }

                    if (nested_list[i].board_url.split('_')[k] == check)
                    {
                        if (Array.isArray(result_list[j]) === true) {
                            result_list[j].push(nested_list[i]);
                        }
                        else {
                            result_list[j] = [result_list[j], nested_list[i]];
                        }
                    }
                }
            }
        }
        for (let i=0; i<result_list.length; i++) {
            let board_html = '';
            let delete_icon = '<div onclick="delete_board($(this))" class="M_board_delete_icon"><i class="fas fa-trash-alt"></i></div>';
            if (Array.isArray(result_list[i]) === true){
                board_html = '<div id="M_sortable_'+ i +'" data-id="'+result_list[i][0].board_url+
                    '"class="M_sortable M_sortable_menu">' + result_list[i][0].board_name;

                for (let j=1; j<result_list[i].length; j++) {
                    if (ACCESS_DENIED_BOARD.indexOf(result_list[i][j].board_url) !== -1) delete_icon = '';
                    board_html += '<div data-id="'+result_list[i][j].board_url+
                        '"class="M_sortable M_sortable_menu">'+result_list[i][j].board_name + delete_icon + '</div>';
                }
            }
            else {
                if (ACCESS_DENIED_BOARD.indexOf(result_list[i].board_url) !== -1) delete_icon = '';
                board_html = '<div id="M_sortable_'+ i +'" data-id="'+result_list[i].board_url+
                    '"class="M_sortable M_sortable_menu">' + result_list[i].board_name + delete_icon + '</div>';
            }
            board_html += '</div>';
            $('#M_sortable_list').append(board_html);

            let board_list = document.getElementById('M_sortable_' + i);
            let new_sortable = new Sortable(board_list, {
                group: {
                    name: 'M_sortable_' + i,
                    put: false
                },
                animation: 150,
                fallbackOnBody: true,
                swapThreshold: 0.65
            });
            sortable_list.push(new_sortable);
        }
        for (let i=0; i<sortable_list.length; i++){
            if (sortable_list[i].toArray().length != 0) final_result.push(sortable_list[i].toArray());
        }
    });

    let board_ajax = A_JAX(TEST_IP+'get_boards_origin', 'GET', null, null);

    $.when(board_ajax).done(function () {
        for (let i=0; i<final_result.length; i++) {

            for (let j=0; j<final_result[i].length; j++) {
                for (let k=0; k<board_ajax.responseJSON.boards.length; k++) {
                    if (board_ajax.responseJSON.boards[k].board_url == final_result[i][j]) {
                        let tmp = board_ajax.responseJSON.boards[k];
                        tmp.board_rank = j;
                        send_data.push(tmp);
                    }
                }
            }
        }
        board_rank = board_ajax.responseJSON.boards[board_ajax.responseJSON.boards.length - 1];
    });
}

$(document).ready(function(){
    M_setting_init_data_first();
    M_setting_init_data();
});


function nav_submit(new_board, delete_board){
    $('#M_loading_modal_background').removeClass('display_none');
    let final_result = [];
    for (let i=0; i<sortable_list.length; i++){
        if (sortable_list[i].toArray().length != 0) final_result.push(sortable_list[i].toArray());
    }


    let ajax = A_JAX(TEST_IP+'get_boards_origin', 'GET', null, null);

    let output = new FormData();
    let send_data = new Array;
    $.when(ajax).done(function () {
        for (let i=0; i<final_result.length; i++) {     //5
            for (let j=0; j<final_result[i].length; j++) {  // 9, 8, 1, 2, 1
                for (let k=0; k<ajax.responseJSON.boards.length; k++) { // 19
                    if (ajax.responseJSON.boards[k].board_url == final_result[i][j]) {
                        let tmp = ajax.responseJSON.boards[k];
                        tmp.board_rank = j;
                        send_data.push(tmp);
                    }
                }
            }
        }

        if (new_board) {
            send_data.push(new_board);
        }
        if (delete_board) {
            let delete_board_list;
            for (let j=0; j<send_data.length; j++) {
                if (JSON.stringify(send_data[j]) === JSON.stringify(delete_board)){
                    delete_board_list = j;
                }
            }
            send_data.splice(delete_board_list, 1);
        }
        output.append('boards', JSON.stringify(send_data));
        let send_ajax = A_JAX_FILE(TEST_IP+'board_upload', 'POST', null, output);
        $.when(send_ajax).done(function() {
            $('#M_loading_modal_background').addClass('display_none');
            let send_json = send_ajax.responseJSON;
            if (send_json['result'] == 'success'){
                snackbar("메뉴를 설정하였습니다.");
                M_setting_init_data_first();
                M_setting_init_data();
                //location.reload();
            } else {
                snackbar("일시적인 오류로 메뉴를 적용하지 못하였습니다.");
            }
        });
    });
}

var selected_tags_cnt = 0;
let selected_tags = [];
function select_tag(target) {
    if (target.hasClass('M_tag_nav'))
    {
        target.removeClass('M_tag_nav');
        let index = selected_tags.indexOf(target[0].innerText);
        selected_tags.splice(index, 1);
        selected_tags_cnt -= 1;
    }
    else 
    {
        if (selected_tags_cnt == 2){
            snackbar("태그는 최대 2개만 선택 가능합니다.");
            return;
        }
        target.addClass('M_tag_nav');
        selected_tags.push(target[0].innerText);
        selected_tags_cnt += 1;
    }
}

function create_board() {
    let new_board = {'board_access': 0, 'board_name': '', 'board_url': '', 'board_rank': 0};

    if ($('#admin_access_checkbox').is(':checked')  === true ) new_board.board_access = 1;
    new_board.board_rank = board_rank.board_rank+1;
    new_board.board_name = $('#M_new_board_name').val();
    let tags_div = $('.M_tag_nav');
    let tags = [];
    if (tags_div.length < 1) {
        snackbar('게시판 태그를 최소 1개 이상 선택해야 합니다.');
        return;
    }
    for (let i=0; i < tags_div.length; i++) {
        tags.push(tags_div[i].innerText.split(' ')[1]);
    }
    new_board.board_url = tags.join('_');

    nav_submit(new_board);
}

function delete_board(target) {
    let board = send_data.filter(data => {
        return data.board_name === target[0].parentNode.innerText;
    });

    nav_submit(null, board[0])
}