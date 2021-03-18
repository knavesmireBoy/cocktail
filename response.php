<?php
$unit;

function open($str)
{
    return "<tr><td>$str</td>";
}

function concat($b)
{
    return function ($a) use ($b)
    {
        return $a . $b;
    };
}

function concat_curry($b)
{
    return function ($a) use ($b)
    {
        return $b . $a;
    };
}

function close($n)
{
    return "<td>$n</td></tr>";
}

function colspanHead($v)
{
    $str = "<h3>Bartender! Get me a <span>$v<span>!</h3><section><section><table><tr><th colspan='2'>RECIPE</th></tr>";
    print !empty($v) ? $str : "<h3>Bartender!</h3><section><section><table><tr><th colspan='2'>RECIPE</th></tr>";
}

function colspan($v, $k)
{
    if ($k === 'cocktail')
    {
        colspanHead($v);
    }
    else
    {
        //print "<tr><td colspan='2' class='method'>Method: </td></tr><tr><td colspan='2'>$v</td></tr>";
        print "<tr><td colspan='2' class='method'>$v</td></tr>";
    }
}

function output($o)
{
    return function ($c) use ($o)
    {
        print open($o) . close($c);
    };
}

function inc($arg)
{
    $list = array(
        'submit',
        'go',
        'x',
        'y' /*, 'on', */
    );
    return !empty($arg) && !in_array($arg, $list);
}

if (isset($_POST['action']) and $_POST['action'] == 'go')
{
?>
<div id="response">
        <aside><img src="img/harrington_book_.jpg"></aside>
            <p>Sometime in 1997 a friend recently returned from Cuba dropped by, told of his travels and raved about the cocktails imbibed at the famous "La Floradita" bar. The search term 'Floridita' led us to a great little site hosted at www.hotwired.com/cocktail. Classic cocktails were beginning to enjoy something of a <a href="https://www.berkeleyside.com/2017/09/15/west-coast-cocktail-revival-started-emeryville-thanks-man">renaissance</a>, not least due to the efforts of<a href="http://frodelius.com/goodspiritsnews/paulharrington.html"> Paul Harrington</a>, who had penned the hotwired articles and was practising what he preached at the Townhouse Bar &#38; Grill in Emeryville, CA. There was enough material to justify publishing a companion book <a href="https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2" title="by Paul Harrington and Laura Moorhead. Illustrations by Douglas Bowman.">“Cocktail”</a> which appeared in the following year. The hardcover book is a treasure trove and, as I soon discovered, deserved better than being pawed over in the kitchen at party time. A bar-friendly digest was in order. Taking inspiration from the wonderful <a href="https://dribbble.com/shots/18495-Frisco">illustrations</a> in “Cocktail”, I got to down to some serious photoshopping, sneaked in a cheeky print run and produced a comb-bound booklet, or three, of, mostly, classic cocktail recipes.</p><p>When I enrolled in a web design refresher course many years later I had a brainwave. Why not re-purpose the booklet as my chosen personal project. By this time the original hotwired site was long gone, but an archive of sorts was maintained by enthusiasts at <a href="https://www.chanticleersociety.org/index.php?title=Main_Page">The Chanticleer Society</a>. I was able to grab some copy and complete my project.</p><p>On embarking upon this responsive version of that old project I discovered the Chanticleer archive was no longer to be found. Shame. However, all is not lost. Quoted searches from passages of the book will still fetch up Harrington's original copy in various sites, often uncredited. I also discovered discrepancies between the hotwired articles and the printed version. Due no doubt to the constraints of the printed page it was clear that most articles had gone through a few rounds of judicious editing. The text on this site is a facsimile of the published book, one of two in my possession. You can still pick up a <a href= "https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2--">copy</a> on Amazon, albeit for the price of a very good single malt. I do aspire to get the thing into a database at some point, although it may very well drive me to drink. Speaking of which...
            </p>              
    <?php
    /*We present the result in a table so first have to hang-on to the VALUE of the ingredient, store in a closure and on the next pass invoke the table row with the VALUE of the measure. This in itself is a composite of number and unit, two more closures.
    The design of the form has the unit choice (oz/ml) coming AFTER the base spirit but BEFORE the other ingredients
    so we hang on to the ingredient name in $curry and then add the value of the unit on the next pass. The value of this (oz/ml) is set for the remaining ingredients.
    */

    $res = $_POST;
    $output = NULL;
    $partial = NULL;
    $curry = NULL;

    foreach ($res as $k => $v)
    {
        $v = str_replace('_', ' ', $v);
        echo ($k);
        if (is_array($v))
        {
            $partial = concat($v[0]);
            if (isset($curry) && isset($output))
            {
                $output($curry($v[0]));
                $output = NULL;
            }
            continue;
        }

        if ($k === 'cocktail')
        {
            colspan($v, $k);
            continue;
        }

        if (inc($v) && inc($k))
        {

            if ($k === 'prep')
            {
                colspan($v, $k);
            }
            /*
             elseif($k === 'Email'){
                output($k)($v);
                $output = NULL;
            }
            */
            elseif (isset($output))
            {

                if (!isset($curry))
                {
                    $curry = concat_curry($v);
                    continue;
                }
                $v = isset($partial) ? $partial($v) : $v;
                $output($v);
                $output = NULL;
            }
            else
            {
                //exit($v);
                $output = output($v);
            }
        } //!empty
        
    } //foreach
    echo '</table></section><a><img src="img/cbook.jpg"></a></section><p>I should point out that the "RULES" are taken from another marvellous <a href="https://www.amazon.co.uk/Esquire-Drinks-Opinionated-Irreverent-Drinking/dp/1588162052">book</a> by a more establshed writer on the subject.</p></div>';
} //isset
else
{ ?>
<div id="response">
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
      <ul><li><label for="prep">Preparation:</label><textarea id="prep" maxlength="150" placeholder="To prepare: first off, plenty of ice!" cols="30" rows="5" name="prep"></textarea></li></ul>
        <!--<ul><li><label for="email">Email:</label><input type="email" name="email" id="email" ></li></ul>-->
<!--required aria-required ="true" -->
        <ul><li><input type="hidden" name="action" value="go">
            <input id="lemon" type="image" src="img/button.png" alt="Submit" value="Submit"/>
            <!--<input type="submit" name="submit" value="Submit">--></li></ul>
        </form></div>
<?php
}