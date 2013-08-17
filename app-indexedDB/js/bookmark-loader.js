var idb = require('./idb'),
    bookmarkRepo = require('./bookmark-repository'),
    tagGroupRepo = require('./tag-group-repository');

function loadChromeBookmarks(bookmarkTreeNodes, tagGroup) {
    var node,
        i,
        len,
        tags,
        newTagGroup,
        newTags;

    for(i=0, len = bookmarkTreeNodes.length; i < len; i++) {
        node = bookmarkTreeNodes[i];

        if (node.url) {
//            bookmarkRepo.create({
//                tagGroupId: tagGroup && tagGroup.id,
//                title: node.title,
//                url: node.url,
//                dateAdded: node.dateAdded
//            });
        } else {
            tags = (tagGroup && tagGroup.tags) || [];
            newTags = _.clone(tags);
            newTags.push(node.title);
            tagGroupRepo.create(newTags, {
                onSuccess: function (results) {
                    if(node.children) {
                        loadChromeBookmarks(node.children, results[0]);
                    }
                }
            });


        }
    }
}
//findTagGroup(['Ideas']);
window.findTagGroup = function (tags) {
    tagGroupRepo.findAll(tags, {
        onSuccess: function (results) {
            console.log(results);
        },
        onFailure: function (r) {
            console.log(r);
        }
    });
    tagGroupRepo.findExact(tags, {
        onSuccess: function (results) {
            console.log(results);
        },
        onFailure: function (r) {
            console.log(r);
        }
    });

}

module.exports = {
    loadChromeBookmarks: function (bookmarkTreeNodes) {
        idb.loadIndexedDB({
            onSuccess: function () {
                loadChromeBookmarks(bookmarkTreeNodes, null);

            }
        });
    },
    loadBookmarksFromChrome: function () {
        chrome.bookmarks.getTree(function (tree) {
            loadChromeBookmarks(tree[0].children[0].children, null);
            console.log(tagGroupRepo.findAll(['Ideas'])); // todo: remove this
        });
    },
    bookmarkRepo: bookmarkRepo,
    tagGroupRepo: tagGroupRepo
};
