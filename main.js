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
            // Chiamo ajax per recuperare il contenuto dell'API (FILM)
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
                        // aggiungo il controllo se la lingua ha la bandiera allora la metto altrimenti stampo il nome della lingua
                        if (bandiereDisponibili.includes(film[i].original_language)) {
                            var bandiera = InserisciBandiera(film[i].original_language);
                            var state = '<img src="images/' + bandiera + '.png" alt="' + bandiera + '">';
                        } else {
                            var state = film[i].original_language;
                        }
                        var film_corrente = film[i];
                        var titolo = film_corrente.title;
                        var titoloOriginale = film_corrente.original_title;
                        var numero_stelle = normalizza_voto(voto);
                        var voto = film_corrente.vote_average;

                        // Creo la viariabile html per inserire il risultato e appenderlo in un div vuoto già creato
                        // la parte a sinistra sono le variabili nel template nell'html, quelle di destra sono i valori effettivi
                        var context = {
                            titolo: '<h2>' + titolo + '</h2>',
                            titoloOriginale: titoloOriginale,
                            stato: state,
                            voto: crea_stelline(numero_stelle)
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
            // Chiamata per le SerieTV
            $.ajax({
                'url': api_url + 'search/tv',
                'data': {
                    'api_key': '68ad21daba12040bb0c1a3b65b05bb45',
                    'query': testo_ricerca,
                    'language': 'it-IT'
                },
                'method': 'GET',
                'success': function(data) {
                    var film = data.results;
                    for (var i = 0; i < film.length; i++) {
                        if (bandiereDisponibili.includes(film[i].original_language)) {
                            var bandiera = InserisciBandiera(film[i].original_language);
                            var state = '<img src="images/' + bandiera + '.png" alt="' + bandiera + '">';
                        } else {
                            var state = film[i].original_language;
                        }
                        var film_corrente = film[i];
                        // controllo se esiste la proprietà title per l'oggetto film_corrente
                        if (film_corrente.hasOwnProperty('title')) {
                            // se è definita è un film cioè il titolo è nella proprietà title
                            var titolo = film_corrente.title;
                            var tipo = 'film';
                            console.log(tipo);
                        } else {
                            // se non è definita la proprietà title è una serie cioè il titolo usa la proprietà name
                            var titolo = film_corrente.name;
                            var tipo = 'serie tv';

                        }
                        if (film_corrente.hasOwnProperty('original_title')) {
                            var titoloOriginale = film_corrente.original_title;
                        } else {
                            var titoloOriginale = film_corrente.original_name;
                        }
                        var numero_stelle = normalizza_voto(voto);
                        var voto = film_corrente.vote_average;
                        var context = {
                            titolo: '<h2>' + titolo + '</h2>',
                            titoloOriginale: titoloOriginale,
                            stato: state,
                            voto: crea_stelline(numero_stelle),
                            type: tipo
                        };
                        var html = template_function(context);
                        $(".contenitore-film").append(html);
                    }
                },
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

    function normalizza_voto(votazione) {
        var voto_meta = votazione / 2;
        // trovo il voto da 1 a 5 dividendo per 2
        var numero_arrotondato = Math.ceil(voto_meta);
        // arrotondo il numero per eccesso
        return numero_arrotondato;
        // restituisco il nuovo voto ottenuto
    }

    function crea_stelline(n_stelline) {
        // creo 5 stelline
        var stelline = '';
        for (var i = 0; i < 5; i++) {
            if (i < n_stelline) {
                // n_stelline saranno piene
                stelline += '<i class="fas fa-star"></i>';
            } else {
                // 5 - n_stelline saranno vuote
                stelline += '<i class="far fa-star"></i>';
            }
        }
        // restituisco la stringa contenente le 5 stelline (alcune piene e alcune vuote)
        return stelline;
        // termino il document ready
    }
});
