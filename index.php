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
    <script src="js/ajax.js"></script>
</head>
<body id="home">
        <header>
<section>
<h1>Welcome <span>to the</span> Little <em>Cocktail</em> <span>Site</span></h1>
<h2><em>What's it going to be...</em></h2></section>
    <ul><li><a href="c1"></a></li><li><a href="c5"></a></li><li><a href="c3"></a></li><li><a href="c6"></a></li><li><a href="c4"></a></li><li><a href="c2"></a></li></ul></header>
<div class="wrapper">

    <main>
        <div id="landing">
        <div class="placeholder"><img src="img/fc.jpg" id="base"/></div>
        <section id="controls" class="static">
            <button id="backbutton"></button>
            <button id="playbutton"></button>
            <button id="forwardbutton"></button>
        </section>
        </div>
        <?php
        
if (isset($_POST['action']) and $_POST['action'] == 'go') {
    include 'response.php';
}
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
      <ul><li><label for="prep">Preparation:</label><textarea id="prep" placeholder="To prepare: first off, plenty of ice!" cols="30" rows="5" name="prep"></textarea></li></ul>
        <!--<ul><li><label for="email">Email:</label><input type="email" name="email" id="email" ></li></ul>-->
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
          <script>
        var hijax = window.speakEasy.Hijax(),
            c = speakEasy.Util.$('landing');
              console.log(speakEasy.Util.getBody())
              
        hijax.setContainer(document.forms[0]);
        hijax.setCanvas(c);
        hijax.setUrl('response.php');
        hijax.setCallback(_.partial(speakEasy.Util.addClass, 'response', speakEasy.Util.getBody));
        hijax.captureData();
    </script>

    <!--<script src="js/slideshow.js"></script>-->
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
