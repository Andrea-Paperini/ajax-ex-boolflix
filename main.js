$(document).ready(function() {
    var bandiereDisponibili = [
        'en',
        'it',
        'es',
        'us',
        'de',
        'fr'
    ]
    // stabilisco una variabile per url iniziale dell'API
    var api_url = 'https://api.themoviedb.org/3/';
    // associo il click sul bottone che usa la funzione di ricerca dei film
    $(".btn").click(function() {
        cercaFilm();
    });
    // associo alla classe cerca una funzione keypress per avviare la ricerca digitando invio
    $('.cerca').keypress(function() {
        if (event.which == 13) {
            cercaFilm();
        }
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
                        aggiungo il controllo se la lingua ha la bandiera allora la metto altrimenti stampo il nome della lingua
                        if (bandiereDisponibili.includes(film[i].original_language)) {
                            var bandiera = InserisciBandiera(film[i].original_language);
                            var state = '<img src="images/' + bandiera + '.png" alt="' + bandiera + '">';
                        } else {
                            var state = film[i].original_language;
                        }
                        var film_corrente = film[i];
                        var titolo = film_corrente.title;
                        var titoloOriginale = film_corrente.original_title;


                        var voto = film_corrente.vote_average;

                        // Creo la viariabile html per inserire il risultato e appenderlo in un div vuoto già creato
                        // la parte a sinistra sono le variabili nel template nell'html, quelle di destra sono i valori effettivi
                        var context = {
                            titolo: titolo,
                            titoloOriginale: titoloOriginale,
                            stato: state,
                            voto: voto
                        };
                        var html = template_function(context);
                        $(".contenitore-film").append(html);
                    }
                },

                // Definisco l'errore nel caso in cui se ne verifichi uno
                'error': function() {
                    alert("Error!");
                }
            });
        }
    }

    function InserisciBandiera(bandiera) {
        var nomeImmagine = '';
        switch (bandiera) {
            case 'it':
                nomeImmagine = 'italia';
                break;
            case 'us':
                nomeImmagine = 'usa';
                break;
            case 'es':
                nomeImmagine = 'spagna';
                break;
            case 'en':
                nomeImmagine = 'regnounito';
                break;
            case 'fr':
                nomeImmagine = 'francia';
                break;
            case 'de':
                nomeImmagine = 'germania';
                break;
        }
        return nomeImmagine;
    }
    // termino il document ready
});
