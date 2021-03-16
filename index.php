<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="width=device-width, initial-scale=1" name="viewport">
    <title>Welcome</title>
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/fonts.css">
           	<script>
	   document.cookie='resolution='+Math.max(screen.width,screen.height)+'; path=/'; 
	</script>
    <script src="js/matchMedia.js"></script>
    <script src="js/modernizr.js"></script>
</head>
<body id="home">
        <header>
<section>
<h1>Welcome <span>to the</span> Little <em>Cocktail</em> <span>Site</span></h1>
<h2><em>What's it going to be...</em></h2></section>
    <ul><li><a href="c1"></a></li><li><a href="c5"></a></li><li><a href="c3"></a></li><li><a href="c6"></a></li><li><a href="c4"></a></li><li><a href="c2"></a></li></ul></header>
<div class="wrapper">

    <main><div>
        <div class="placeholder"><img src="img/fc.jpg" id="base"/></div>
        <section id="controls" class="static">
            <button id="backbutton"></button>
            <button id="playbutton"></button>
            <button id="forwardbutton"></button>
        </section>
        </div>
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
    
    function close($n){
        return "<td>$n</td></tr>";
    }
    
     function colspanHead($v){
        print "<h3>Bartender!, get me a $v</h3><table>";
    }
    

     function colspan($v, $k){
         if($k === 'Cocktail'){
             colspanHead($v);
         }
         else {
             print "<tr><td colspan='2' class='method'>Method: </td></tr><tr><td colspan='2'>$v</td></tr>";
         }
    }
    
    function output($o){
        return function($c) use($o) {
          print open($o) . close($c); 
        };
    }
        
        
     function inc($arg) {
        $list = array('Submit', 'on', 'ml', 'oz', 'go', 'X', 'Y');
        return !empty($arg) && !in_array($arg, $list);
    }
  
        
        
if (isset($_POST['action']) and $_POST['action'] == 'go') {
    ?>
        <div id="response">
            
    <?php
    
    $res = $_POST;
    $fn = NULL;
    $add = NULL;
       
    foreach ($res as $k => $v) {
        $k = ucfirst($k);
        $v = str_replace('_', ' ', $v);
        
        if(is_array($v)){
            $add = concat($v[0]);
            continue;
        }
        
        if (inc($v) && inc($k)) {
            if($k === 'Cocktail' || $k === 'Prep'){
                colspan($v, $k);
            }
             elseif($k === 'Email'){
                output($k)($v);
                $fn = NULL;
            }
            elseif(isset($fn)){
             
                $fn($v);
                $fn = NULL;
            }
            else {
                $fn = output($v);
                }
            }//!empty
        }//foreach
    echo '</table>';
                ?>
            <!--https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2-->
            <aside><img src="img/harrington_book_.jpg"></aside>
        <p>In about 1997 a friend recently returned from Cuba was raving about the "La Floradita" bar he'd frequented.
            A internet search fetched upon the now sadly defunct site (www.hotwired.com/cocktail/archive/) and the Floridita cocktail.
            A year or so later an accompanying book was published. I got copies for myself and friends. Still available, deep pockets required. The book reads better sat back with a favoured glass then hunched over a bar. I decided to come up with a bar-friendly version, taking inspiration from the wonderful illustrations I got busy on photoshop and sneaked in a short print run to prouduce a comb-bound booklet of, mostly, classic cocktail recipes. I decided re-purpose the booklet when I attended a web design refresher course. By this time the original site had disappeared, but it was kind of archived at <a href="https://www.chanticleersociety.org/index.php?title=Main_Page">The Chanticleer Society</a>. In turn that too has disappeared. However quoted searches will still fetch up the articles Paul Harrington wrote. (The actual text on this site is a replica of the published book, slightly tighter than the original hotwired articles.)
            </p></div>
            
        <?php }//isset
        else { ?>
    <form  action="." method="post">
        <fieldset><legend>or  mix your own...</legend></fieldset>
        <ul>
            <li><label for="cocktail">Name</label><input type="text" name="cocktail" id="cocktail" placeholder="">
            <li id="reset"><input type="reset" name="reset" value="X" title="Reset the form"></li>
            <li><label for="spirit">Base Spirit</label><select name="spirit" id="spirit">
                <option value="">Your poison...</option>
                <option value="Gin">Gin</option>
                <option value="Vodka">Vodka</option>
                <option value="Tequila">Tequila</option>
                <option value="Light_Rum">Light Rum</option>
                <option value="Dark_Rum">Dark Rum</option>
                <option value="Rye">Rye</option>
                <option value="Bourbon">Bourbon</option>
                <option value="Scotch">Scotch</option>
                <option value="Brandy">Brandy</option>
            </select></li>

            <li><label for="m1">Measure</label><input type="number" step="any" name="m1" id="m1"></li>
            <li class="unit"><label>Units:</label><label for="oz" title="Specify all measures in ounces">oz</label><input type="radio" name="unit[]" id="oz" value="oz"><label for="ml" title="Specify all measures in milliliters">ml</label><input type="radio" name="unit[]" id="ml" value="ml" checked></li>
        </ul>
        <fieldset class="ingredients"><legend><b><em>Further Ingredients</em></b></legend>
            <ul> <li><label for="i2">Second</label><input type="text" name="second" id="i2"></li><li><label for="m2">Measure</label><input type="number" step="any" name="m2" id="m2"></li>
                <li><label for="i3">Third</label><input type="text" name="third"  id="i3"></li><li><label for="m3">Measure</label><input type="number" step="any" name="m3" id="m3"></li>
                <li><label for="i4">Fourth</label><input type="text" name="fourth" id="i4"></li><li><label for="m4">Measure</label><input type="number" step="any" name="m4" id="m4"></li>
            </ul></fieldset>
        <ul>
            <li><label for="dash">Add Bitters:</label><input type="checkbox" name="dash" id="dash"></li></ul>
      <ul><li><label for="prep">Preparation:</label><textarea id="prep" placeholder="To prepare: first off, plenty of ice!" cols="30" rows="5" name="prep"></textarea></li></ul><ul><li><label for="email">Email:</label><input type="email" name="email" id="email" ></li></ul>
<!--required aria-required ="true" -->
        <ul><li><input type="hidden" name="action" value="go">
            <input id="lemon" type="image" src="img/button.png" alt="Submit" value="Submit"/>
            <!--<input type="submit" name="submit" value="Submit">--></li></ul>
        </form>
        <?php } ?>
        </main>
    <footer>
  <div class="arrow-down"></div>
  <p><a href="http://www.hearst.com/">&copy;2015 Hearst Communications, Inc.</a> All Rights Reserved
  </p></footer></div>
    <script src="js/viewportSize.js"></script>
    <script src="js/shims.js"></script>
    <script src="js/underscore.js"></script>
    <script src="js/classlist.js"></script>
    <script src="js/basicIterator.js"></script>
    <script src="js/global.js"></script>
    <script src="js/slideshow.js"></script>
    </body>
</html>

<!--

\n\s+
(^[^<]+?)\n
//no para tag
\n\s*(?=[A-Z])\n

//opening tag only
(?)\n\s*(?=<)

\n ]+>([^<]+)
//replace end of sentence with ...
(?<=\.)(?<=\))?\s
//copy option value to option
(?<=")(.+)">
$1">$1
//add trailing slash to root directories
(?<="../c\d)(?!\/)

-->
