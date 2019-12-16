$(document).ready(function() {
    // stabilisco una variabile per url iniziale dell'API
    var api_url = 'https://api.themoviedb.org/3/';
    // associo il click sul bottone che usa la funzione di ricerca dei film
    $(document).on("click", ".btn", function() {
        cercaFilm();
    });
    // termino il document ready
});

function cercaFilm() {
    // Rimuovo la lista dei film
    $('.film').remove();
    // Recupero l'html del template
    var template_html = $('#template-film').html();
    // Compilo l'html con la funzione di handlebars
    var template_function = Handlebars.compile(template_html);
    // Creo una variabile per salvare il testo scritto nell'input
    var testo_ricerca = $('.cerca').val();
    // Verifico se input è vuoto altrimenti non vado avanti
    if (testo_ricerca.length != 0) {
        // Chiamo ajax per recuperare il contenuto dell'API
        $.ajax({
                // uso url, data e api_key per mantenere il codice più pulito
                'url': api_url + 'search/movie',
                'data': {
                    'api_key': '68ad21daba12040bb0c1a3b65b05bb45',
                    'query': testo_ricerca,
                    // imposto la lingua italiana per i contenuti
                    'language': 'it-IT'
                },
                'method': 'GET',
                // Creo diverse variabili per salvare con la dot notation la risposta dell'API (titolo, titolo originale, lingua e la media delle votazioni)
                'success': function(data) {
                    var film = data.results;
                    for (var i = 0; i < film.length; i++) {
                        var film_corrente = film[i];
                        var titolo = film_corrente.title;
                        var titoloOriginale = film_corrente.original_title;
                        var lingua = film_corrente.original_language;
                        var voto = film_corrente.vote_average;
                    }
                    // Creo la viariabile html per inserire il risultato e appenderlo in un div vuoto già creato
                    var html = template_function();
                    $(".contenitore-film").append(html);
                }
            },
            // Definisco l'errore nel caso in cui se ne verifichi uno
            'error': function() {
                alert("Error!");
            });
    }
}
