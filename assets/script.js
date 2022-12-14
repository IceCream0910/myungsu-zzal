//onload
$(function () {
    Kakao.init('cf575f9210b7ec64665aecad9bbcbbab');

    //초기 세팅
    const defaultKeywords = ['분노', '슬픔', '우울', '귀찮', '피곤']
    var random = Math.floor(Math.random() * defaultKeywords.length);
    $.ajax({
        url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDLaCdl1ckCDfURHjCGwcRRLnu0Afrsrwo&cx=35cc76baf4e73d7f8&searchType=image&q=박명수 짤' + defaultKeywords[random],
        type: 'GET',
    }).done(function (response) {
        console.log(response.items[0].link);
        if (response) {
            $('#result').html('');
            for (var i = 0; i < response.items.length; i++) {
                if (response.items[i].fileFormat != 'image/') { //이미지 아님
                    $('#result').append(`
            <figure class="post-image" onclick="updateImgUrl('${response.items[i].link}');" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
            <a href="${response.items[i].link}" itemprop="contentUrl" data-size="${response.items[i].image.width}x${response.items[i].image.height}">
                <img src="${response.items[i].link}" itemprop="thumbnail" onerror="this.style.display='none'"  style="width: 100%;
                    border-radius: 20px;
                    object-fit: cover;" />
            </a>
            <figcaption itemprop="caption description"></figcaption>
        </figure>
        `);
                }
            }

        } else {
            alert('검색 결과가 없습니다.');
        }
    });
});

var imgLink = '';
var lastQuery = '';
var lastIndex = 0;

function submit() {
    const text = $('#text-input').val();
    if (text) {
        lastQuery = text;
        lastIndex = 0;
        $.ajax({
            url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDLaCdl1ckCDfURHjCGwcRRLnu0Afrsrwo&cx=35cc76baf4e73d7f8&searchType=image&q=박명수 짤 ' + text,
            type: 'GET',
        }).done(function (response) {
            console.log(response.items[0].link);
            if (response) {
                $('#result').html('');
                for (var i = 0; i < response.items.length; i++) {
                    if (response.items[i].fileFormat != 'image/') { //이미지 아님
                        $('#result').append(`
                <figure class="post-image" onclick="updateImgUrl('${response.items[i].link}');" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
                <a href="${response.items[i].link}" itemprop="contentUrl" data-size="${response.items[i].image.width}x${response.items[i].image.height}">
                    <img src="${response.items[i].link}" itemprop="thumbnail" onerror="this.style.display='none'"  style="width: 100%;
                        border-radius: 20px;
                        object-fit: cover;" />
                </a>
                <figcaption itemprop="caption description"></figcaption>
            </figure>
            `);
                    }
                }
                $('html, body').animate({
                    scrollTop: $('html').offset().top
                }, 500);

            } else {
                alert('검색 결과가 없습니다.');
            }
        });
    }

}


function loadMore() {
    const text = $('#text-input').val();
    if (text) {
        $.ajax({
            url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDLaCdl1ckCDfURHjCGwcRRLnu0Afrsrwo&cx=35cc76baf4e73d7f8&searchType=image&q=박명수 짤 ' + lastQuery + '&start=' + lastIndex,
            type: 'GET',
        }).done(function (response) {
            console.log(response.items[0].link);
            if (response) {
                for (var i = 0; i < response.items.length; i++) {
                    if (response.items[i].fileFormat != 'image/') { //이미지 아님
                        $('#result').append(`
                <figure class="post-image" onclick="updateImgUrl('${response.items[i].link}');" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
                <a href="${response.items[i].link}" itemprop="contentUrl" data-size="${response.items[i].image.width}x${response.items[i].image.height}">
                    <img src="${response.items[i].link}" itemprop="thumbnail" onerror="this.style.display='none'"  style="width: 100%;
                        border-radius: 20px;
                        object-fit: cover;" />
                </a>
                <figcaption itemprop="caption description"></figcaption>
            </figure>
            `);
                    }
                }
            } else {
                alert('검색 결과가 없습니다.');
            }
        });
    }

}


$('#text-input').on('keypress', function (e) {
    if (e.keyCode === 13) {
        submit();
    }
});


const Element = document.querySelector('.bottomOfList')
const options = {}
// observer: IntersectionObserver instance
const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && $('#result').html().length > 5) {
            if (lastQuery) {
                lastIndex += 10;
                loadMore();
            }
        }
    })
}, options)

io.observe(Element)



function updateImgUrl(url) {
    imgLink = url;
}

function sendImage() {
    if (imgLink) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '',
                description: '',
                imageUrl: imgLink,
                link: {
                    mobileWebUrl: 'https://myungsu.sungil.me',
                    webUrl: 'https://myungsu.sungil.me',
                },
            },
        });
    }
}

//  1초마다 반복
setInterval(function () {
    if ($('.pswp').is(':visible')) {
        $('.float-btn').show();
    } else {
        $('.float-btn').hide();
    }
}, 100);
