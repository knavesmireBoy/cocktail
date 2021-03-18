<?php
$unit;
          
    function open($str){
        return "<tr><td>$str</td>";
    }
        
        function concat($b){
            return function($a) use($b){
                return $a . $b;
            };
        }
        
          function concat_curry($b){
            return function($a) use($b){
                return $b . $a;
            };
        }
    
    function close($n){
        return "<td>$n</td></tr>";
    }
    
     function colspanHead($v){
        $str = "<h3>Bartender! Get me a <span>$v<span>!</h3><section><table><tr><th colspan='2'>RECIPE</th></tr>";
        print !empty($v) ? $str : "<h3>Bartender!</h3><section><table><tr><th colspan='2'>RECIPE</th></tr>";
    }
    

     function colspan($v, $k){
         if($k === 'cocktail'){
             colspanHead($v);
         }
         else {
             //print "<tr><td colspan='2' class='method'>Method: </td></tr><tr><td colspan='2'>$v</td></tr>";
             print "<tr><td colspan='2' class='method'>$v</td></tr>";
         }
    }
    
    function output($o){
        return function($c) use($o) {
          print open($o) . close($c); 
        };
    }
        
        
     function inc($arg) {
        $list = array('submit', 'on', 'ml', 'oz', 'go', 'x', 'y');
        return !empty($arg) && !in_array($arg, $list);
    }
  
        
        
if (isset($_POST['action']) and $_POST['action'] == 'go') {
    ?>
            <aside><img src="img/harrington_book_.jpg"></aside>
            <p>Sometime in 1997 a friend recently returned from Cuba dropped by, told of his travels and raved about the cocktails imbibed at the famous "La Floradita" bar. The search term 'Floridita' led us to a great little site hosted at www.hotwired.com/cocktail. Classic cocktails were beginning to enjoy something of a <a href="https://www.berkeleyside.com/2017/09/15/west-coast-cocktail-revival-started-emeryville-thanks-man">renaissance</a>, not least due to the efforts of<a href="http://frodelius.com/goodspiritsnews/paulharrington.html"> Paul Harrington</a>, who had penned the hotwired articles and was practising what he preached at the Townhouse Bar &#38; Grill in Emeryville, CA. There was enough material to justify publishing a companion book <a href="https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2" title="by Paul Harrington and Laura Moorhead. Illustrations by Douglas Bowman.">“Cocktail”</a> which appeared in the following year. The hardcover book is a treasure trove and, as I soon discovered, deserved better than being pawed over in the kitchen at party time. A bar-friendly digest was in order. Taking inspiration from the wonderful <a href="https://dribbble.com/shots/18495-Frisco">illustrations</a> in “Cocktail”, I got to down to some serious photoshopping, sneaked in a cheeky print run and produced a comb-bound booklet, or three, of, mostly, classic cocktail recipes.</p><p>When I enrolled in a web design refresher course many years later I had a brainwave. Why not re-purpose the booklet as my chosen personal project. By this time the original hotwired site was long gone, but an archive of sorts was maintained by enthusiasts at <a href="https://www.chanticleersociety.org/index.php?title=Main_Page">The Chanticleer Society</a>. I was able to grab some copy and complete my project.</p><p>On embarking upon this responsive version of that old project I discovered the Chanticleer archive was no longer to be found. Shame. However, all is not lost. Quoted searches from passages of the book will still fetch up Harrington's original copy in various sites, often uncredited. I also discovered discrepancies between the hotwired articles and the printed version. Due no doubt to the constraints of the printed page it was clear that most articles had gone through a few rounds of judicious editing. The text on this site is a facsimile of the published book, one of two in my possession. You can still pick up a <a href= "https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2--">copy</a> on Amazon, albeit for the price of a very good single malt. I do aspire to get the thing into a database at some point, although it may very well drive me to drink. Speaking of which...
            </p>              
    <?php
    
    /*We present the result in a table so first have to hang-on to the VALUE of the ingredient, store in a closure and on the next pass invoke the table row with the VALUE of the measure. This in itself is a composite of number and unit, two more closures.
    The design of the form has the unit choice (oz/ml) coming AFTER the base spirit but BEFORE the other ingredients
    so we hang on to the ingredient name in $pre and then add the value of the unit on the next pass. The value of this (oz/ml) is set for the remaining ingredients.
    */
    
    $res = $_POST;
    $fn = NULL;
    $post = NULL;
    $pre = NULL;
       
    foreach ($res as $k => $v) {
        //$k = ucfirst($k);
        $v = str_replace('_', ' ', $v);
        
        if(is_array($v)){
            $post = concat($v[0]);
            if(isset($pre) && isset($fn)){
                $fn($pre($v[0]));
                $fn = NULL; 
            }
            continue;
        }
        
        if($k === 'cocktail'){
                colspan($v, $k);
            continue;
            }
        
        if (inc($v) && inc($k)) {
            
            if($k === 'prep'){
                colspan($v, $k);
            }
            /*
             elseif($k === 'Email'){
                output($k)($v);
                $fn = NULL;
            }
            */
            elseif(isset($fn)){
                if(!isset($pre)){
                    $pre = concat_curry($v);
                    continue;
                }
                $v = isset($post) ? $post($v) : $v;
                $fn($v);
                $fn = NULL;
            }
            else {
                $fn = output($v);
                }
            }//!empty
        }//foreach
    echo '</table></section><a><img src="img/cbook.jpg"></a><p>I should point out that the "RULES" are taken from another marvellous <a href="https://www.amazon.co.uk/Esquire-Drinks-Opinionated-Irreverent-Drinking/dp/1588162052">book</a> by a more establshed writer on the subject.</p>';
 }//isset