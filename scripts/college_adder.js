const colleges = [
  "Christ's College",
  "Churchill College",
  "Clare College",
  "Clare Hall",
  "Corpus Christi College",
  "Darwin College",
  "Downing College",
  "Emmanuel College",
  "Fitzwilliam College",
  "Girton College",
  "Gonville & Caius College",
  "Homerton College",
  "Hughes Hall",
  "Jesus College",
  "King's College",
  "Lucy Cavendish College",
  "Magdalene College",
  "Murray Edwards College",
  "Newnham College",
  "Pembroke College",
  "Peterhouse",
  "Queens' College",
  "Robinson College",
  "Selwyn College",
  "Sidney Sussex College",
  "St Catharine's College",
  "St Edmund's College",
  "St John's College",
  "Trinity College",
  "Trinity Hall",
  "Wolfson College"
];

// jQuery autocomplete functionality
$(document).ready(function () {
  $('#college').on('input', function () {
    const inputVal = $(this).val().toLowerCase();
    const suggestions = colleges.filter(c =>
      c.toLowerCase().includes(inputVal)
    );

    // Remove existing suggestion box
    $('.autocomplete-suggestions').remove();

    if (inputVal.length === 0 || suggestions.length === 0) return;

    // Create suggestion box
    const suggestionBox = $('<div class="autocomplete-suggestions"></div>');
    suggestions.forEach(college => {
      const suggestionItem = $('<div class="suggestion-item"></div>').text(college);
      suggestionItem.on('click', function () {
        $('#college').val(college);
        $('.autocomplete-suggestions').remove();
      });
      suggestionBox.append(suggestionItem);
    });

    // Append to body (or position next to input)
    const offset = $('#college').offset();
    suggestionBox.css({
      position: 'absolute',
      top: offset.top + $('#college').outerHeight(),
      left: offset.left,
      width: $('#college').outerWidth(),
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      zIndex: 1000
    });

    $('body').append(suggestionBox);
  });

  // Dismiss on click outside
  $(document).on('click', function (e) {
    if (!$(e.target).is('#college') && !$(e.target).closest('.autocomplete-suggestions').length) {
      $('.autocomplete-suggestions').remove();
    }
  });
});