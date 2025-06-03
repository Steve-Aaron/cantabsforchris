$(document).ready(function () {
  $.getJSON("./endorsements.json", function (data) {
    const supportersGrid = $("#supporters-grid");
    const carouselContainer = $(".endorsements-carousel");

    data.forEach(function (supporter, index) {
      // Grid card
      const card = $(`
        <div class="endorsement-card" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="endorsement-author">
            <div class="author-image">
              <img src="${supporter.image}" alt="${supporter.name}" 
                   onerror="this.src='images/placeholder-person.webp'">
            </div>
            <div class="author-info">
              <h3>${supporter.name}</h3>
              <span>${supporter.title}</span>
              ${supporter.affiliation ? `<span>${supporter.affiliation}</span>` : ""}
              ${supporter.college ? `<span>${supporter.college}</span>` : ""}
            </div>
          </div>
          <div class="endorsement-content">
            <p class="endorsement-text">"${supporter.endorsement}"</p>
          </div>
        </div>
      `);
      supportersGrid.append(card);

      // Carousel item
      const item = $(`
        <div class="testimonial-item textquote-item ${index === 0 ? 'active' : ''}">
          <p class="testimonial-quote textquote-quote">"${supporter.endorsement}"</p>
          <div class="testimonial-author textquote-author">
            <img src="${supporter.image}" alt="${supporter.name}" 
                 onerror="this.src='images/placeholder-person.webp'" class="textquote-image">
            <div class="testimonial-name textquote-name">${supporter.name}</div>
            <div class="testimonial-title textquote-title">
              ${supporter.title}${supporter.affiliation ? `, ${supporter.affiliation}` : ""}
            </div>
          </div>
        </div>
      `);
      carouselContainer.append(item);
    });

    // AOS refresh for grid
    AOS.refresh();

    // Carousel controls
    let currentIndex = 0;
    const items = $(".testimonial-item");

    function showItem(index) {
      items.hide().eq(index).fadeIn(300);
    }

    $("#testimonial-prev").on("click", function () {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      showItem(currentIndex);
    });

    $("#testimonial-next").on("click", function () {
      currentIndex = (currentIndex + 1) % items.length;
      showItem(currentIndex);
    });

    showItem(currentIndex);
  }).fail(function () {
    console.error("Failed to load supporters data");
    $("#supporters-grid").html(
      '<p class="text-white">Unable to load supporter information at this time.</p>'
    );
  });
});
