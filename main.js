function createObserver(callback) {
  return new MutationObserver(function(mutations, self) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        callback();
      }
    });
  });
}

function isCommits() {
  parts = location.href.split('/');
  return parts[5] === "commits"
}

function isPullCommits() {
  parts = location.href.split('/');
  return parts[5] === "pull" && parts[7] === "commits";
}

function createCompareUi() {
  // commitsページでもpull/commitsページでも無ければ何もしない
  if(!isCommits() && !isPullCommits()) return;

  // 既にボタンがついていたら何もしない
  if($('a.compare-button').size() > 0) return;

  var $commits = $("div.commit-links-cell.table-list-cell");
  if($commits.size() == 0) return;

  $commits.append('<div class="commit-links-group btn-group commit-compare-list"><input type="radio" name="compare_base" style="margin-right:3px;"><input type="radio" name="compare_to" style="margin-left:3px;"></div>');
  $commits.eq(0).find('input[type=radio]').click();

  var $compareButton = $('<a>').attr('class','btn btn-sm compare-button').text('Compare Diff');
  $compareButton.click(function() {
    var base = $('input[name=compare_base]:checked').parent().parent().find('a.sha').text().trim();
    var to = $('input[name=compare_to]:checked').parent().parent().find('a.sha').text().trim();
    var url = (function(){
      var parts = location.href.split('/');
      return 'https://' + parts[2] + '/' + parts[3] +
            '/' + parts[4] + '/compare/' + base + '...' + to;
    })();
    location.href = url;
  });

  if (isPullCommits()) {
    $('#commits_bucket').prepend($compareButton);
  } else {
    $('div.file-navigation:eq(0)').append($compareButton);
  }
}

$(function() {
  var $container  = $('#js-repo-pjax-container')[0];
  var observer    = createObserver(createCompareUi);
  observer.observe($container, { childList: true, subtree: true, attributes: true });
  createCompareUi();
});

