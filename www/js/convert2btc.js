$(function() {
    var api_url = "http://btcpricer.com";
    var cur, ss = {};
    $('[class^="convert-"]').each(function() {
        var bits = $(this).attr('class').split('-');
        if (bits[1] == 'btc') {
            cur = bits[2];
            this.from_btc = true;
        } else if (bits[2] == 'btc') {
            cur = bits[1];
            this.from_btc = false;
        }
        this.orig_price = parseFloat($(this).text());
        this.cur = cur;
        if (cur in ss) ss[cur].push(this);
        else ss[cur] = [this];
    });

    var cur_price, btc_price;
    var update = function() {
        for (cur in ss) {
            $.ajax({url: api_url + '/rate/' + cur.toUpperCase() + '/',
                    context: ss[cur],
                    dataType: 'jsonp'}).done(function(data) {
                for (var i=0;i<this.length;i++) {
                    if (this[i].from_btc) {
                        cur_price = this[i].orig_price * data.btc_price;
                        $(this[i]).html(this[i].orig_price + " BTC (~" + cur_price.toFixed(2) + " " + this[i].cur.toUpperCase() + ")");
                    } else {
                        btc_price = this[i].orig_price / data.btc_price;
                        $(this[i]).html(this[i].orig_price + " (~" + btc_price.toPrecision(4) + " BTC)");
                    }
                }
            });
        }
    }
    update();
    setInterval(update, 300000);
});
