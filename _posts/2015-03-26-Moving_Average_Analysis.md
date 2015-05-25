---
layout: default_blog
title: "Portfolio Moving Average Analysis"
date: 2015-03-26
---


<br>
<br>


<meta charset="utf-8" />
<title>Moving Average Analysis</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>

<!-- Custom stylesheet, it must be in the same directory as the html file -->
<link rel="stylesheet" href="/css/custom.css">

<!-- Loading mathjax macro -->
<!-- Load mathjax -->
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
    <!-- MathJax configuration -->
    <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        tex2jax: {
            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
            processEscapes: true,
            processEnvironments: true
        },
        // Center justify equations in code and markdown cells. Elsewhere
        // we use CSS to left justify single line equations in code cells.
        displayAlign: 'center',
        "HTML-CSS": {
            styles: {'.MathJax_Display': {"margin": 0}},
            linebreaks: { automatic: true }
        }
    });
    </script>
    <!-- End of mathjax configuration -->


<body>
  <div tabindex="-1" id="notebook" class="border-box-sizing">
    <div class="container" id="notebook-container">

<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<h1 id="moving-average-analysis">Moving Average Analysis</h1>
<p>When analyzing my portfolio, I have been stumbling through a variety of algorithmic trading strategies and trying to understand the metrics used by hedge funds and others in quantitative finance. This will outline moving averages on a portfolio. Here are a few of the links I used for research:</p>
<p><a href="http://qr.ae/j2cUT">http://qr.ae/j2cUT</a></p>
<p><a href="http://www.analyticbridge.com/profiles/blogs/how-to-compute-moving-average-in-r-language-and-python">http://www.analyticbridge.com/profiles/blogs/how-to-compute-moving-average-in-r-language-and-python</a></p>
<p><a href="http://connor-johnson.com/2014/02/01/smoothing-with-exponentially-weighted-moving-averages/">http://connor-johnson.com/2014/02/01/smoothing-with-exponentially-weighted-moving-averages/</a></p>
<p><a href="http://pandas.pydata.org/pandas-docs/dev/computation.html">http://pandas.pydata.org/pandas-docs/dev/computation.html</a></p>
<p><a href="http://www.investopedia.com/university/movingaverage/movingaverages2.asp">http://www.investopedia.com/university/movingaverage/movingaverages2.asp</a></p>
<p><a href="http://tradingsim.com/blog/simple-moving-average/">http://tradingsim.com/blog/simple-moving-average/</a></p>
<p><a href="http://www.forbes.com/sites/katestalter/2012/04/27/how-a-top-trader-uses-moving-average-crossovers/2/">http://www.forbes.com/sites/katestalter/2012/04/27/how-a-top-trader-uses-moving-average-crossovers/2/</a></p>
<p><br></p>
<p>This notebook is setup as a script to run through and generate outputs for a variety of analysis points around financial crossover points.</p>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[1]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># IMPORTS</span>
<span class="kn">from</span> <span class="nn">pandas.io.data</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">from</span> <span class="nn">pandas</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">from</span> <span class="nn">pandas.tools.plotting</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">import</span> <span class="nn">matplotlib.pyplot</span> <span class="kn">as</span> <span class="nn">plt</span>
<span class="kn">import</span> <span class="nn">plotly.plotly</span> <span class="kn">as</span> <span class="nn">py</span>
<span class="kn">from</span> <span class="nn">plotly.graph_objs</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">from</span> <span class="nn">scipy</span> <span class="kn">import</span> <span class="n">stats</span>
<span class="kn">import</span> <span class="nn">math</span>

<span class="kn">import</span> <span class="nn">io</span><span class="o">,</span> <span class="nn">os</span><span class="o">,</span> <span class="nn">sys</span><span class="o">,</span> <span class="nn">types</span>
<span class="kn">from</span> <span class="nn">IPython.nbformat</span> <span class="kn">import</span> <span class="n">current</span>
<span class="kn">from</span> <span class="nn">IPython.core.interactiveshell</span> <span class="kn">import</span> <span class="n">InteractiveShell</span>

<span class="o">%</span><span class="k">run</span> <span class="n">Portfolio_Moving_Averages_Functions</span><span class="o">.</span><span class="n">ipynb</span>

<span class="o">%</span><span class="k">matplotlib</span> <span class="n">inline</span>
<span class="n">plt</span><span class="o">.</span><span class="n">rcParams</span><span class="p">[</span><span class="s">&#39;figure.figsize&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="mi">16</span><span class="p">,</span> <span class="mi">12</span>  <span class="c"># that&#39;s default image size for this </span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br><br></p>
<h1 id="crossover-analysis">Crossover Analysis</h1>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[2]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">symbols</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VXX&#39;</span><span class="p">,</span> <span class="s">&#39;SSO&#39;</span><span class="p">,</span> <span class="s">&#39;SDS&#39;</span><span class="p">]</span>
<span class="n">VXX</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VXX&#39;</span><span class="p">]</span> <span class="c"># volatility index</span>
<span class="n">SSO</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;SSO&#39;</span><span class="p">]</span> <span class="c"># 2x bull run s&amp;p</span>
<span class="n">SDS</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;SDS&#39;</span><span class="p">]</span> <span class="c"># 2x bear (inv) run s&amp;p</span>
<span class="n">GSPC</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;^GSPC&#39;</span><span class="p">]</span> <span class="c"># s&amp;p index</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[3]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">GSPC</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-10 00:00:00
Account Value: 10000
	Buy Price: 1255.18
	Num Shares: 7.0
	Remaining Value: 1213.74
Sell Date: 
2001-07-09 00:00:00
	Sell Price: 1198.78
	Updated Value: 9605.2

-------------------------

Buy Date: 
2002-03-27 00:00:00
Account Value: 9605.2
	Buy Price: 1144.58
	Num Shares: 8.0
	Remaining Value: 448.56
Sell Date: 
2002-04-15 00:00:00
	Sell Price: 1102.55
	Updated Value: 9268.96

-------------------------

Buy Date: 
2003-04-29 00:00:00
Account Value: 9268.96
	Buy Price: 917.84
	Num Shares: 10.0
	Remaining Value: 90.56
Sell Date: 
2004-08-05 00:00:00
	Sell Price: 1080.7
	Updated Value: 10897.56

-------------------------

Buy Date: 
2004-10-06 00:00:00
Account Value: 10897.56
	Buy Price: 1142.05
	Num Shares: 9.0
	Remaining Value: 619.11
Sell Date: 
2004-10-11 00:00:00
	Sell Price: 1124.39
	Updated Value: 10738.62

-------------------------

Buy Date: 
2004-11-11 00:00:00
Account Value: 10738.62
	Buy Price: 1173.48
	Num Shares: 9.0
	Remaining Value: 177.3
Sell Date: 
2005-10-27 00:00:00
	Sell Price: 1178.9
	Updated Value: 10787.4

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 10787.4
	Buy Price: 1234.72
	Num Shares: 8.0
	Remaining Value: 909.64
Sell Date: 
2006-06-28 00:00:00
	Sell Price: 1246.0
	Updated Value: 10877.64

-------------------------

Buy Date: 
2006-07-27 00:00:00
Account Value: 10877.64
	Buy Price: 1263.2
	Num Shares: 8.0
	Remaining Value: 772.04
Sell Date: 
2006-07-28 00:00:00
	Sell Price: 1278.55
	Updated Value: 11000.44

-------------------------

Buy Date: 
2006-08-18 00:00:00
Account Value: 11000.44
	Buy Price: 1302.3
	Num Shares: 8.0
	Remaining Value: 582.04
Sell Date: 
2007-09-06 00:00:00
	Sell Price: 1478.55
	Updated Value: 12410.44

-------------------------

Buy Date: 
2007-09-12 00:00:00
Account Value: 12410.44
	Buy Price: 1471.56
	Num Shares: 8.0
	Remaining Value: 637.96
Sell Date: 
2007-11-28 00:00:00
	Sell Price: 1469.02
	Updated Value: 12390.12

-------------------------

Buy Date: 
2009-06-22 00:00:00
Account Value: 12390.12
	Buy Price: 893.04
	Num Shares: 13.0
	Remaining Value: 780.6
Sell Date: 
2010-06-11 00:00:00
	Sell Price: 1091.6
	Updated Value: 14971.4

-------------------------

Buy Date: 
2010-10-01 00:00:00
Account Value: 14971.4
	Buy Price: 1146.24
	Num Shares: 13.0
	Remaining Value: 70.28
Sell Date: 
2011-08-15 00:00:00
	Sell Price: 1204.49
	Updated Value: 15728.65

-------------------------

Buy Date: 
2012-01-19 00:00:00
Account Value: 15728.65
	Buy Price: 1314.5
	Num Shares: 11.0
	Remaining Value: 1269.15
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 2081.9
	Updated Value: 24170.05


===============================

^GSPC:
Final Value Basic: 14573.3
Final Value Crossover: 24170.05




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[4]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[4]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/279.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[5]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">GSPC</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6cAAAMeCAYAAADh2XLNAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3Xus5XV9//vXB6iXHiYzA61ABTpDtCoJ7VBrvdUwmh9V
G4ueHuulisIhRGttwWpOpbFxahMvTTWtPWmJSAvWn2g9v1pbtd6IRE2jxMbx8sPbtI7CFEEEFK8F
+z1/zJ5hMzN79nuGPev7Wd/1eCQ77LX2Wns9Z+21L2/W9713G4YhAAAAMKajxg4AAAAAwykAAACj
M5wCAAAwOsMpAAAAozOcAgAAMDrDKQAAAKM76HDaWjultfaR1tr/bq19vrX2e0vnb2ut3dBa+/TS
y5OXXeeS1tpXWmtfbK396rLzH95a+9zS2/7iyP2TAAAAmDftYH/ntLV2YpITh2HY3lo7Nsm/JXla
kmckuWMYhjfsc/nTk7wtySOSPDDJh5M8eBiGobV2bZIXD8NwbWvtfUneOAzD+4/IvwoAAIC5ctBn
Todh+MYwDNuXXv9uki9k99CZJO0AV3lqkquGYbhzGIadSXYkeWRr7aQk64ZhuHbpcm/J7iEXAAAA
6junrbVNSc5M8omls363tfaZ1trlrbUNS+f9TJIbll3thuweZvc9f1fuHnIBAABYcKXhdOmQ3v8v
yUVLz6D+dZLNSbYkuTHJ649YIQAAAJN3zGoXaK39RJL/leStwzD8Y5IMw3Dzsre/Ock/L53cleSU
ZVc/ObufMd219Pry83cd4LZWXoAFAABg7g3DcKAV0VV/W29LcnmS64Zh+PNl55+07GL/Z5LPLb3+
T0me1Vq7T2ttc5IHJ7l2GIZvJPlOa+2RS+/z3CT/uELomrw8//nPX7P3pUlTr12aNC1ClyZNi9Cl
SdMidGnSNAwHfy5ytWdOH5vkuUk+21r79NJ5f5jk2a21LUmGJF9N8oKlwfK61trfJ7kuyV1JXjTc
XfCiJFckuX+S9w1H+Df1btq06Ui++8OiqabHpqTPLk01mup67NJUo6muxy5NNZrqeuzSVLPITQcd
Todh+HgO/OzqvxzkOq9O8uoDnP9vSc441EAAAACmr/zbeufNhg0bVr/QjGmq6bEp6bNLU42muh67
NNVoquuxS1ONproeuzTVLHLTZIfTLVu2jJ2wH001PTYlfXZpqtFU12OXphpNdT12aarRVNdjl6aa
RW5qqy2lzlJrbeipBwAAmB+7f/cqvTjQbNday7DCb+td9U/JAAAAzAtPdvXhcP5HwWQP673mmmvG
TtiPppoem5I+uzTVaKrrsUtTjaa6Hrs01Wiq67Grxyb6MtnhFAAAgPlh5xQAAJiEpX3GsTPIyh+L
g+2ceuYUAABggX3961/PunXrRh/sJzuc9nhMu6aaHpuSPrs01Wiq67FLU42muh67NNVoquuxa6ym
1toRf6natGlTfvInfzLr1q3Lcccdl6c85Sm54YYbjsi/+6ijjsqxxx6bdevW5eSTT85LX/rS/Pd/
//cBL3vqqafmjjvuGP23HU92OAUAANhtOIIvda21vOc978kdd9yRG2+8MSeccEJ+93d/917/61by
2c9+NnfccUeuvvrqvO1tb8tll12232XuuuuuI3b7h8rOKQAAMAkH2nPc/WzgkZwx6nuumzdvzuWX
X54nPOEJSZL3ve99eclLXpIvfelLSZKtW7fm3HPPzQUXXJAkueKKK3L55ZfnYx/7WH7nd34n97//
/fNnf/Zne9/fOeeckyc84Qm5+OKL97uto446Kjt27Mhpp52WJHnGM56RE088MS996UuzefPmvPnN
b84f//EfZ/PmzbnyyiuzefPm3HXXXTnqqKNy66235qUvfWk++MEP5gc/+EHOOuusvOtd70qSvOc9
78krXvGKfO1rX8vpp5+eSy+9NGecccb+94qdUwAAgH7tGdi+//3v5x3veEce/ehH733bwQ4TPu+8
83LVVVftvf4tt9ySq6++Os95znNWva3rrrsuH/vYx3LmmWfufdtHP/rRfPGLX8wHPvCB/YbIc889
Nz/84Q9z3XXX5eabb87v//7vJ0k+/elP54ILLshll12WW2+9NS94wQtyzjnn5L/+678O457Y32SH
U8fZ12iq67FLU42muh67NNVoquuxS1ONproeu3psmrVhGPK0pz0tGzduzIYNG3L11VfnZS97Wem6
j3jEI7J+/fpcffXVSZK3v/3tefzjH5+f/umfXvE6v/iLv5jjjjsu55xzTi688MKcf/75ewfRbdu2
5f73v3/ue9/73uM6N954Y97//vfn0ksvzfr163PMMcfkcY97XJLkTW96U17wghfkEY94RFpred7z
npf73ve++cQnPnE4d8d+JjucAgAA9KS1lne/+9257bbb8qMf/Sh/+Zd/mbPOOis333xz6frPe97z
8ta3vjVJ8ta3vjXnnnvuQS//6U9/Orfeemt27NiRV73qVfd42ymnnHLA61x//fU57rjjsn79+v3e
9rWvfS2vf/3rs3Hjxr0vN9xwQ2688cZS/2rsnAIAAJMwbzunSfKABzwgl156aX7jN34jT3nKU/LE
Jz5x7y9Jeu1rX5v3vve9+djHPpYkueGGG3LGGWfkmmuuyVlnnZWbbrppv2c+99h353SPnTt35rTT
Ttu7X7rveTfddFNOPvnk3HrrrfsNqC984Qtz6qmn5g//8A9Xv1fsnAIAAPRrz8A2DMPeZ1Ef9rCH
JUm2bNmSf/iHf8gPfvCD7NixI5dffvk9dlBPPvnk/NIv/VKe97zn5elPf/qKg+m9cdJJJ+XJT35y
XvSiF+X222/PnXfemY9+9KNJkgsvvDCXXnpprr322gzDkO9973t573vfm+9+97trctuTHU57PKZd
U02PTUmfXZpqNNX12KWpRlNdj12aajTV9djVY9MYfv3Xfz3r1q3L+vXr80d/9Ed5y1vesnc4fclL
XpL73Oc+OeGEE3L++efnuc997n7Xf/7zn5/Pfe5zqx7Se7C/WXqgty0/7+/+7u/yEz/xE3noQx+a
E044IW984xuTJA9/+MNz2WWX5cUvfnGOO+64PPjBD85b3vKW0r+74pg1e08AAABdWnlQm6WvfvWr
B3378ccfnw984AP3OO+Vr3zlPU7/7M/+bE455ZScddZZB31fP/7xjw94/qZNm/Z7277nbdy4MVdc
ccUBr//EJz4xT3ziEw9624fLzikAADAJK+05TsWdd96ZZz3rWTnzzDPzile8Yuycg7JzCgAAMEFf
+MIXsnHjxtx00025+OKLx845IiY7nPZ4TLummh6bkj67NNVoquuxS1ONproeuzTVaKrrsavHpnny
sIc9LN/97nfz8Y9/PMcee+zYOUfEZIdTAAAA5oedUwAAYBKmvnM6T+ycAgAAMJcmO5z2eEy7ppoe
m5I+uzTVaKrrsUtTjaa6Hrs01Wiq67Grxyb6MtnhFAAAgPlh5xQAAJiEKe+cHnXUUdmxY0dOO+20
nHfeeTnllFPyJ3/yJ/f6/b7mNa/Jf/zHf+Syyy5bg8q72TkFAABYprV2xF+qPv7xj+cxj3lMNmzY
kOOPPz6/8iu/kk996lOH/W86kCuuuCJHH3101q1bl/Xr1+fMM8/Me9/73hXf1yWXXLLmg+nhmuxw
2uMx7ZpqemxK+uzSVKOprscuTTWa6nrs0lSjqa7HrlGbth3Bl6LvfOc7ecpTnpKLLroot912W3bt
2pVXvvKVue9973tI/5Q9DvYM8WMf+9jccccduf3223PBBRfkGc94Rr797W/vd7kf//jHh3XbR8pk
h1MAAIBefPnLX05rLc985jPTWsv97ne/nH322TnjjDP2XuZv/uZvcvrpp+e4447Lk570pHz9618/
rNvaM7i21nL++efnBz/4QXbs2JFt27bl6U9/es4999ysX78+V1xxRbZt25Zzzz1373X3PLu7cePG
nHrqqbnyyiuTJD/60Y/yspe9LD/7sz+bE088Mb/927+dH/7wh/fiHtnfZIfTrVu3jp2wH001PTYl
fXZpqtFU12OXphpNdT12aarRVNdjV49Ns/SQhzwkRx99dM4777y8//3vz2233XaPt7/73e/Oa17z
mrzrXe/KLbfcksc97nF59rOffa9u86677sqb3/zmrFu3Lj/3cz+XJPmnf/qn/OZv/ma+/e1v5znP
ec49Dg/+2te+ll/7tV/LRRddlFtuuSXbt2/Pli1bkiQvf/nLs2PHjnzmM5/Jjh07smvXrrzqVa+6
V337muxwCgAA0It169bl4x//eFprufDCC/OABzwgT33qU3PzzTcnSS699NJccsklechDHpKjjjoq
l1xySbZv357rr7/+kG/rE5/4RDZu3JiTTjop73jHO/Kud70r69atS5I85jGPyTnnnJMkud/97neP
w4Pf9ra35eyzz84zn/nMHH300TnuuOPyC7/wCxmGIZdddlne8IY3ZMOGDTn22GNzySWX5O1vf/sa
3DN3m+xw6jj7Gk11PXZpqtFU12OXphpNdT12aarRVNdjV49Ns/bQhz40f/u3f5vrr78+n//85/Of
//mfufjii5PsftbyoosuysaNG7Nx48Ycf/zxSZJdu3Yd8u086lGPym233ZZvfvOb+dd//dc84QlP
2Pu2k08+ecXrXX/99TnttNP2O/+b3/xmvv/97+fhD3/43r4nP/nJueWWWw657WAmO5wCAAD06iEP
eUie//zn5/Of/3yS5NRTT82b3vSm3HbbbXtfvve97+VRj3rUmt3mar9d+NRTT82///u/73f+T/3U
T+X+979/rrvuur1tt99+e77zne+sWVsy4eG0x2PaNdX02JT02aWpRlNdj12aajTV9dilqUZTXY9d
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
DK21a5O8eBiGa1tr70vyxmEY3r/P7dk5BQAA6EgXO6fDMHxjGIbtS69/N8kXsnvoPCfJlUsXuzK7
B9YkeWqSq4ZhuHMYhp1JdiR5ZGvtpCTrhmG4dulyb1l2HQAAABZceee0tbYpyZlJPpnkhGEYblp6
001JTlh6/WeS3LDsajdk9zC77/m7ls4/Yno8VltTTY9NSZ9dmmo01fXYpalGU12PXZpqNNX12KWp
psemWSkNp0uH9P6vJBcNw3DH8rctHYfrWFwAAAAO2zGrXaC19hPZPZj+3TAM/7h09k2ttROHYfjG
0iG7Ny+dvyvJKcuufnJ2P2O6a+n15efvOtDtnXfeedm0aVOSZMOGDdmyZUu2bt2a5O7/i1A5vXXr
1kO6/CxO7zmvl559/69MLz29nt5zXi89Pn71074ezPdpHz9fD3z8nN5z2teD+T7t4ze/Xw/2+urS
fzevcDr735/bt2/P7bffniTZuXNnDma1X4jUsnun9FvDMLxk2fl/unTe61prL0+yYZ9fiPTLufsX
Ij1o6RcifTLJ7yW5Nsl74xciAQAAdK+LX4iU5LFJnpvk8a21Ty+9PCnJa5Oc3Vr7cpInLJ3OMAzX
Jfn7JNcl+ZckL1o2bb4oyZuTfCXJjn0H07W235TfAU01PTYlfXZpqtFU12OXphpNdT12aarRVNdj
l6aaHptm5aCH9Q7D8PGsPMD+jxWu8+okrz7A+f+W5IxDDQQAAGD6DnpY76w5rBcAAKAvvRzWCwAA
AEfcZIfTHo/V1lTTY1PSZ5emGk11PXZpqtFU12OXphpNdT12aarpsWlWJjucAgAAMD/snAIAALAi
O6cAAAAsjMkOpz0eq62ppsempM8uTTWa6nrs0lSjqa7HLk01mup67NJU02PTrEx2OAUAAGB+2DkF
AABgRXZOAQAAWBiTHU57PFZbU02PTUmfXZpqNNX12KWpRlNdj12aajTV9dilqabHplmZ7HAKAADA
/LBzCgAAwIrsnAIAALAwJjuc9nistqaaHpuSPrs01Wiq67FLU42muh67NNVoquuxS1NNj02zMtnh
FAAAgPlh5xQAAIAV2TkFAABgYUx2OO3xWG1NNT02JX12aarRVNdjl6YaTXU9dmmq0VTXY5emmh6b
ZmWywykAAADzw84pAAAAK7JzCgAAwMKY7HDa47Hammp6bEr67NJUo6muxy5NNZrqeuzSVKOprscu
TTU9Ns3KZIdTAAAA5oedUwAAAFZk5xQAAICFMdnhtMdjtTXV9NiU9NmlqUZTXY9dmmo01fXYpalG
U12PXZpqemyalckOpwAAAMwPO6cAAACsyM4pAAAAC2Oyw2mPx2prqumxKemzS1ONproeuzTVaKrr
sUtTjaa6Hrs01fTYNCuTHU4BAACYH3ZOAQAAWJGdUwAAABbGZIfTHo/V1lTTY1PSZ5emGk11PXZp
qtFU12OXphpNdT12aarpsWlWJjucAgAAMD/snAIAALAiO6cAAAAsjMkOpz0eq62ppsempM8uTTWa
6nrs0lSjqa7HLk01mup67NJU02PTrEx2OAUAAGB+2DkFAABgRXZOAQAAWBiTHU57PFZbU02PTUmf
XZpqNNX12KWpRlNdj12aajTV9dilqabHplmZ7HAKAADA/LBzCgAAwIrsnAIAALAwJjuc9nistqaa
HpuSPrs01Wiq67FLU42muh67NNVoquuxS1NNj02zMtnhFAAAgPlh5xQAAIAV2TkFAABgYUx2OO3x
WG1NNT02JX12aarRVNdjl6YaTXU9dmmq0VTXY5emmh6bZmWywykAAADzw84pAAAAK7JzCgAAwMKY
7HDa47Hammp6bEr67NJUo6muxy5NNZrqeuzSVKOprscuTTU9Ns3KZIdTAAAA5oedUwAAAFZk5xQA
AICFMdnhtMdjtTXV9NiU9NmlqUZTXY9dmmo01fXYpalGU12PXZpqemyalckOpwAAAMwPO6cAAACs
yM4pAAAAC2Oyw2mPx2prqumxKemzS1ONproeuzTVaKrrsUtTjaa6Hrs01fTYNCuTHU4BAACYH3ZO
AQAAWJGdUwAAABbGZIfTHo/V1lTTY1PSZ5emGk11PXZpqtFU12OXphpNdT12aarpsWlWJjucAgAA
MD/snAIAALAiO6cAAAAsjMkOpz0eq62ppsempM8uTTWa6nrs0lSjqa7HLk01mup67NJU02PTrEx2
OAUAAGB+2DkFAABgRXZOAQAAWBiTHU57PFZbU02PTUmfXZpqNNX12KWpRlNdj12aajTV9dilqabH
plmZ7HAKAADA/LBzCgAAwIrsnAIAALAwJjuc9nistqaaHpuSPrs01Wiq67FLU42muh67NNVoquux
S1NNj02zMtnhFAAAgPlh5xQAAIAV2TkFAABgYUx2OO3xWG1NNT02JX12aarRVNdjl6YaTXU9dmmq
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
squfvHTePZx33nnZtGlTkmTDhg3ZsmVLtm7dmiS55ppr9rn0ntNbD3h6z+X3vf5Yp5MkX02yednr
OcDpPf+atbi9XJOV7p+7T6/N7a3V6b1Wun82332Ra665Zu1ub5XH01rd3szvr2Xta3p7c/J42vv5
sNrjac0//65Z+u9Kp+f08bQ597j8rD7/erl/fD0/tNN7+Xp+aP2+nh/0tK/ntdN7+Xp+0NNJfD0v
nN7rML6eb9++PbfffnuSZOfOnTmYNgyH9+Rla+0nkxw9DMMdrbX/I8kHk/xxkv+R5FvDMLyutfby
JBuGYXj50i9Eelt2D7APTPLhJA8algW01oZKT2stqz/p2nK4/7YjpbWWbFvlQtuyZt2Tvp+SNbuv
avdTMrf31TaPqT4fU/3dT8lsH1M+9w7x9ubwMdXn514yt/fVNo+pPh9T/d1PicdUlfupZi0/91pr
GYZh399blOTePXN6QpJ37b6Dc0yS/zkMwwdba59K8vettQuS7EzyjCQZhuG61trfJ7kuyV1JXlSa
RAEAAJi8wx5Oh2H4apItBzj/1ux+9vRA13l1klcf7m0CAAAwTUeNHQAAAACGUwAAAEZnOAUAAGB0
hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgFAABgdIZTAAAA
Rmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSGUwAAAEZnOAUA
AGB0hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgFAABgdIZT
AAAARmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSGUwAAAEZn
OAUAAGB0hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgFAABg
dIZTAAAARmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSGUwAA
AEZnOAUAAGB0hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgF
AABgdIZTAAAARmc4BQAAYHSGUwAAAEZnOAUAAGB0hlMAAABGZzgFAABgdIZTAAAARmc4BQAAYHSG
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
WwAAAABJRU5ErkJggg==
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[6]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">SDS</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
SDS Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2007-08-22 00:00:00
Account Value: 10000
	Buy Price: 177.55
	Num Shares: 56.0
	Remaining Value: 57.2
Sell Date: 
2007-09-17 00:00:00
	Sell Price: 174.76
	Updated Value: 9843.76

-------------------------

Buy Date: 
2007-11-27 00:00:00
Account Value: 9843.76
	Buy Price: 187.32
	Num Shares: 52.0
	Remaining Value: 103.12
Sell Date: 
2009-04-28 00:00:00
	Sell Price: 266.52
	Updated Value: 13962.16

-------------------------

Buy Date: 
2010-07-20 00:00:00
Account Value: 13962.16
	Buy Price: 135.08
	Num Shares: 103.0
	Remaining Value: 48.92
Sell Date: 
2010-07-29 00:00:00
	Sell Price: 130.24
	Updated Value: 13463.64

-------------------------

Buy Date: 
2011-08-19 00:00:00
Account Value: 13463.64
	Buy Price: 106.96
	Num Shares: 125.0
	Remaining Value: 93.64
Sell Date: 
2011-11-03 00:00:00
	Sell Price: 79.64
	Updated Value: 10048.64


===============================

SDS:
Final Value Basic: 903.43
Final Value Crossover: 10048.64




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[7]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[7]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/280.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[8]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">SDS</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6AAAAMeCAYAAAADBWm0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3XuwX2ddL/73k0YK2kwuRUvpLTBAoQ6agtQCMoQzXIqD
bRmxBaGQHqaDoh5AmUN71B85OMPlzJRx9CcHKWCLSLn8jgiCUqBjhI4DHGYIF0PFaFPaUlpKk0K5
2eLz+yPfpjv3nb2/a608a71eM3uy1/e7v3utnXefpO+s57N3qbUGAAAAurZi6AsAAABgGhRQAAAA
eqGAAgAA0AsFFAAAgF4ooAAAAPRCAQUAAKAXhyygpZQHllI+W0rZWkrZVkp5w+zxdaWUT5RSvlZK
+XgpZc2C11xWSvnXUsr1pZRndv0FAAAA0IZyuJ8DWkr5yVrr90spK5Ncl+TVSc5Ncket9X+VUl6T
ZG2t9dJSyhlJ3pPkCUlOSvLJJI+qtf5np18FAAAAR73DbsGttX5/9u4DkhyTZGd2F9CrZo9fleT8
2fvnJbm61npPrXVHku1JzprnBQMAANCmwxbQUsqKUsrWJLcl+Yda6z8nOaHWetvsQ25LcsLs/Ycm
uXnBy2/O7juhAAAATNzKw33AbPvshlLK6iTXlFKets/ztZRyqH28h97jCwAAwCQctoDep9Z6Vynl
o0ken+S2UspDaq3fLKWcmOT22YfdkuSUBS87efbYXg5TWAEAAGhcrbXs+9ghvwlRKeXBSe6tte4q
pTwoyTVJ/meSZyX5dq31TaWUS5Os2eebEJ2V+78J0SPqPicppez70Khs2rQpV1555dCXwRLIrm3y
a5fs2ia/tsmvXbJr29jzK6UcsIAe7g7oiUmuKqWsyO550b+stV5bSvlCkveXUl6aZEeSC5Kk1rqt
lPL+JNuS3Jvk5aNumgexfv36oS+BJZJd2+TXLtm1TX5tk1+7ZNe2qeZ3yAJaa/1ykscd4PE7kzz9
IK95fZLXz+XqAAAAGI3DfhdcjtyaNWuGvgSWSHZtk1+7ZNc2+bVNfu2SXdummp8C2oENGzYMfQks
kezaJr92ya5t8mub/Nolu7ZNNb9DfhOizk468m9CBMD8lLLf9y9gQP7+BmAxlvpNiABgcErP0cE/
BgCwXLbgdmDLli1DXwJLJLu2ya9dsmub/Nomv3bJrm1TzU8BBQAAoBdmQAE4qs1mSIa+DCILABbv
YDOg7oACwMh8/etfz6pVq5RFAI46CmgHprqfewxk1zb5tetIsyuldP62GOvXr89P/uRPZtWqVVm3
bl2e85zn5Oabb17C78DhrVixIscdd1xWrVqVk08+Ob/3e7+X//zP/zzgx5566qn57ne/29s3DbL2
2ia/dsmubVPNTwEFoFG1w7fFKaXkIx/5SL773e/m1ltvzQknnJDf+Z3fmctXdyBf+tKX8t3vfjfX
Xntt3vOe9+SKK67Y72Puvffezs4PAMulgHZg48aNQ18CSyS7tsmvXWPI7thjj82v/uqvZtu2bXse
27hxY97xjnfsOb7yyivzlKc8JUnyW7/1W3n1q1+91+c499xz88d//MeHPdfpp5+epzzlKfnnf/7n
3HjjjVmxYkXe+c535rTTTsvTn/70PY/dd4f0zjvvzMUXX5yTTjop69aty3Of+9w9n+sjH/lINmzY
kLVr1+bJT35yvvzlLx/x1z6G/KZMfu2SXdummp8CCgDLcN+c5fe///28733vyxOf+MQ9zx1qO++m
TZty9dVX73n9HXfckWuvvTYvfOELD3uubdu25dOf/nTOPPPMPc996lOfyvXXX59rrrlmv9nPiy66
KD/84Q+zbdu23H777fnd3/3dJMkXvvCFvPSlL80VV1yRO++8My972cty7rnn5j/+4z+W8DsBAIen
gHZgqvu5x0B2bZNfu1rNrtaa888/P2vXrs2aNWty7bXX7ndX82Ce8IQnZPXq1bn22muTJO9973vz
tKc9LT/90z990Nc87nGPy7p163LuuefmkksuycUXX7ynbG7evDkPetCDcuyxx+71mltvvTUf+9jH
8ta3vjWrV6/OypUr99yFfdvb3paXvexlecITnpBSSl784hfn2GOPzWc+85kj+n1oNT92k1+7ZNe2
qeangALAEpVS8qEPfSg7d+7Mj370o/zpn/5pnvrUp+b2229f1Otf/OIX593vfneS5N3vfncuuuii
Q378F77whdx5553Zvn17Xve61+313CmnnHLA19x0001Zt25dVq9evd9zN954Yy6//PKsXbt2z9vN
N9+cW2+9dVHXDwBHSgHtwFT3c4+B7Nomv3aNIbtSSp773OfmmGOOyXXXXZck+amf+ql873vf2/Mx
3/zmN/d6zYte9KJ86EMfyhe/+MVcf/31Of/885d1/gM55ZRTcuedd+auu+7a77lTTz01v//7v5+d
O3fuebv77rtz4YUXHtG5x5DflMmvXbJr21TzU0ABYBnu2wJba91zN/Qxj3lMkmTDhg3567/+6/zg
Bz/I9u3b8453vGOvonjyySfnF37hF/LiF784z3ve8/bbPjsPJ554Yp797Gfn5S9/eXbt2pV77rkn
n/rUp5Ikl1xySd761rfmc5/7XGqt+d73vpePfvSjufvuu+d+HQCQKKCdmOp+7jGQXdvk166Ws/uV
X/mVrFq1KqtXr84f/uEf5l3veteeAvqqV70qD3jAA3LCCSfk4osvzote9KL9Xv+Sl7wkX/7ylw+7
/fZQP9PzQM8tfOwv//Iv8xM/8RN59KMfnRNOOCF/8id/kiR5/OMfnyuuuCK//du/nXXr1uWRj3xk
3vWudy3q616o5fyQX8tk17ap5rdy6AsAgKU5eCHryw033HDI548//vhcc801ez322te+dq/j0047
Laecckqe+tSnHvJz/fjHPz7g4+vXr9/vuX0fW7t2ba688soDvv5Zz3pWnvWsZx3y3AAwL2Xfb9Xe
y0lLqUOcF4D2lFL2+7EiY3HPPffk+c9/fs4888z8wR/8wdCXc1hjzgKA+Zr9nbHfvxbbggsAA/jq
V7+atWvX5rbbbssrX/nKoS8HAHqhgHZgqvu5x0B2bZNfu6aY3WMe85jcfffdue6663LccccNfTnL
MsX8xkR+7ZJd26aanwIKAABAL8yAAnBUM3d49JAFAItlBhQAAIBBKaAdmOp+7jGQXdvk1y7ZtU1+
bZNfu2TXtqnmp4ACAADQCzOgABzVxjp3uGLFimzfvj0Pf/jDs2nTppxyyin5oz/6o2V/3je84Q35
93//91xxxRVzuMq9jTULAObPDCgAo1FK6fxtMa677ro86UlPypo1a3L88cfnl37pl/L5z39+yV/P
gVx55ZU55phjsmrVqqxevTpnnnlmPvrRjx70c1122WWdlE8AmIeVQ1/AGG3ZsiUbN24c+jJYAtm1
TX7tWlJ2m7u4ksV/7u985zt5znOekz//8z/PBRdckB/96Ef59Kc/nWOPPXZJpzzUncUnP/nJ+dSn
PpVaa/7sz/4sF1xwQb7xjW9k9erVe33cj3/84xxzzDFLOv9yWHttk1+7ZNe2qebnDigALMHXvva1
lFJy4YUXppSSBz7wgXnGM56Rxz72sXs+5p3vfGfOOOOMrFu3Luecc06+/vWvL+lc95XTUkouvvji
/OAHP8j27duzefPmPO95z8tFF12U1atX58orr8zmzZtz0UUX7XntfXdp165dm1NPPTVXXXVVkuRH
P/pRXv3qV+e0007LQx7ykPzmb/5mfvjDHy7jdwQADk8B7cAU/yVjLGTXNvm1q8XsTj/99BxzzDHZ
tGlTPvaxj2Xnzp17Pf+hD30ob3jDG/LBD34wd9xxR57ylKfkBS94wbLOee+99+btb397Vq1alUc9
6lFJkg9/+MP5tV/7tdx111154QtfuNdW3htvvDG//Mu/nFe84hW54447snXr1mzYsCFJcumll2b7
9u354he/mO3bt+eWW27J6173uiVdV4v5cT/5tUt2bZtqfgooACzBqlWrct1116WUkksuuSQ/8zM/
k/POOy+33357kuStb31rLrvsspx++ulZsWJFLrvssmzdujU33XTTEZ/rM5/5TNauXZsTTzwx73vf
+/LBD34wq1atSpI86UlPyrnnnpskeeADH7jXVt73vOc9ecYznpELL7wwxxxzTNatW5ef//mfT601
V1xxRd785jdnzZo1Oe6443LZZZflve997xx+ZwDg4BTQDkz1Z/qMgezaJr92tZrdox/96PzFX/xF
brrppnzlK1/JN77xjbzyla9Msvvu4yte8YqsXbs2a9euzfHHH58kueWWW474PGeffXZ27tyZb33r
W/mnf/qn/Jf/8l/2PHfyyScf9HU33XRTHv7wh+/3+Le+9a18//vfz+Mf//g91/fsZz87d9xxxxFf
W9Jufuwmv3bJrm1TzU8BBYA5OP300/OSl7wkX/nKV5Ikp556at72trdl586de96+973v5eyzz57b
OQ/3HXtPPfXU/Nu//dt+jz/4wQ/Ogx70oGzbtm3Pte3atSvf+c535nZtAHAgCmgHprqfewxk1zb5
tavF7P7lX/4lb37zm/fc0bzpppty9dVX54lPfGKS5Dd+4zfy+te/Ptu2bUuS3HXXXfnABz5wwM+1
1J+tebjX/fqv/3o++clP5gMf+EDuvffefPvb384Xv/jFrFixIpdcckle+cpX5lvf+laS3XdmP/7x
jy/pOlrMj/vJr12ya9tU81NAAWAJVq1alc9+9rP5xV/8xRx33HF54hOfmJ/7uZ/L5ZdfniQ5//zz
85rXvCbPf/7zs3r16jz2sY/NNddcs+f1C+9cHupO5pE+t/CxU089NX/3d3+Xyy+/PMcff3zOPPPM
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
TX7tkl3b5Nc2+bVLdm2T3wK24C5TKeWMJOcleejsoVuSfLjWum24q2IxZNc2+bVLdm2TX9vk1y7Z
tU1+91NAAQAA6IUZ0GUopawppbyxlHJ9KWVnKeXO2ftvLKWsGfr6ODjZtU1+7ZJd2+TXNvm1S3Zt
k9/eFNDleX+SnUk2JllXa12X5GlJds2e4+glu7bJr12ya5v82ia/dsmubfJbwBbcZSilfK3W+qgj
fY7hya5t8muX7Nomv7bJr12ya5v89uYO6PLcWEr576WUE+57oJTykFLKa5J8fcDr4vBk1zb5tUt2
bZNf2+TXLtm1TX4LKKDLc2GSByf5x9l+7p1JtiQ5PskFQ14YhyW7tsmvXbJrm/zaJr92ya5t8lvA
FlwAAAB64Q7onJRSHrfP8eOHuhaOjOzaJr92ya5t8mub/Nolu7bJTwGdp9/c5/g3BrkKlkJ2bZNf
u2TXNvm1TX7tkl3bJp+fLbgAAAD0YuXQF9C6UsqKJGcleejsoVuSfK5q9kc92bVNfu2SXdvk1zb5
tUt2bZPf/dwBXYZSyjOTvCXJ9iQ3zx4+Ockjk7y81nrNUNfGocmubfJrl+zaJr+2ya9dsmub/Pam
gC5DKeX6JOfUWnfs8/jDkvx9rfXRg1wYhyW7tsmvXbJrm/zaJr92ya5t8tubb0K0PMdk9+3zfd0S
25uPdrJrm/zaJbu2ya9t8muX7NomvwUm9wXP2TuT/N9SytW5/3b6KUmeP3uOo5fs2ia/dsmubfJr
m/zaJbu2yW8BW3CXqZRyRpLzsvdA8YdrrduGuyoWQ3Ztk1+7ZNc2+bVNfu2SXdvkdz8FFAAAgF6Y
AV2GUsqaUsobSynXl1J2llLunL3/xlLKmqGvj4OTXdvk1y7ZtU1+bZNfu2TXNvntTQFdnvcn2Zlk
Y5J1tdZ1SZ6WZNfsOY5esmub/Nolu7bJr23ya5fs2ia/BWzBXYZSytdqrY860ucYnuzaJr92ya5t
8mub/Nolu7bJb2/ugC7PjaWU/15KOeG+B0opDymlvCbJ1we8Lg5Pdm2TX7tk1zb5tU1+7ZJd2+S3
gAK6PBcmeXCSf5zt596ZZEuS45NcMOSFcViya5v82iW7tsmvbfJrl+zaJr8FbMEFAACgF+6Azkkp
5XH7HD9+qGvhyMiubfJrl+zaJr+2ya9dsmub/BTQefrNfY5/Y5CrYClk1zb5tUt2bZNf2+TXLtm1
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
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[9]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">([</span><span class="s">&#39;^GSPC&#39;</span><span class="p">],</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">],</span> <span class="n">start_date</span><span class="o">=</span><span class="s">&#39;1/1/2009&#39;</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2009-05-21 00:00:00
Account Value: 10000
	Buy Price: 888.33
	Num Shares: 11.0
	Remaining Value: 228.37
Sell Date: 
2010-06-11 00:00:00
	Sell Price: 1091.6
	Updated Value: 12235.97

-------------------------

Buy Date: 
2010-10-01 00:00:00
Account Value: 12235.97
	Buy Price: 1146.24
	Num Shares: 10.0
	Remaining Value: 773.57
Sell Date: 
2011-08-15 00:00:00
	Sell Price: 1204.49
	Updated Value: 12818.47

-------------------------

Buy Date: 
2012-01-19 00:00:00
Account Value: 12818.47
	Buy Price: 1314.5
	Num Shares: 9.0
	Remaining Value: 987.97
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 2081.9
	Updated Value: 19725.07


===============================

^GSPC:
Final Value Basic: 20819.0
Final Value Crossover: 19725.07




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[10]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[10]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/281.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[11]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="p">[</span><span class="s">&#39;^GSPC&#39;</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6cAAAMeCAYAAADh2XLNAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3X2wnWV9L/zvFbBoSyYv2AJCMDoiygxtkPpex+iIYscC
Ti1oFQ2Pw6jUF2ydI5y20xw7g9oZHGufWiuCSH3Al+fUo/UFVEaOMh3l6BBEI8W0BiEiLxIUfCvY
6/yRRdiEEFayrr2v+975fGb2ZN33Wvde1175zoJv7vu3dqm1BgAAAHpa0nsBAAAAoJwCAADQnXIK
AABAd8opAAAA3SmnAAAAdKecAgAA0N0uy2kpZVUp5UullG+XUr5VSnnjZP/6UsqNpZSrJl8vnHPM
WaWU75ZSri2lPH/O/mNKKddM7vvb+fuRAAAAGJuyq99zWko5KMlBtdYNpZT9k3wjyYlJTkpyZ631
XTs8/sgkFyV5cpJDknwxyeG11lpKuTLJ62utV5ZSPpvkPbXWS+blpwIAAGBUdnnmtNb6w1rrhsnt
u5J8J9tKZ5KUnRxyQpKLa61311o3J9mU5KmllIOTLK21Xjl53IXZVnIBAABg+pnTUsrqJEcn+epk
1xtKKVeXUs4rpSyf7HtUkhvnHHZjtpXZHfdvyX0lFwAAgL3cVOV0cknv/5/kTZMzqP+Q5DFJ1iS5
Kck587ZCAAAAFr19H+oBpZSHJfmfST5ca/1fSVJrvWXO/R9I8i+TzS1JVs05/NBsO2O6ZXJ77v4t
O3muBx+ABQAAYPRqrTsbEd11OS2llCTnJdlYa333nP0H11pvmmy+OMk1k9ufSnJRKeVd2XbZ7uFJ
rpx8INJPSilPTXJlklOSvOdBFjr9T7UXW7duXS644ILey2CRkCdakylakylakylak6npbKuYO/dQ
Z06fmeQVSb5ZSrlqsu+/J3lZKWVNkprke0lekyS11o2llI8l2ZjkniSn1/va5ulJLkjyiCSf9Um9
s1m9enXvJbCIyBOtyRStyRStyRStydTsdllOa61XZOdzqZ/bxTFnJzl7J/u/keSo3V0gAAAAi9/U
n9bLsCxfvvyhHwRTkidakylakylakylak6nZKacjtWbNmt5LYBGRJ1qTKVqTKVqTKVqTqdmVIX0A
USmlDmk9AADAeOzqw3ZYeDvrdqWUPfu0XgAAgDFxsmsY9uQfClzWO1KXX3557yWwiMgTrckUrckU
rckUDI9yCgAAQHdmTgEAgEVhMs/Yexnkwf8udjVz6swpAADAXuz73/9+li5d2r3YK6cjZU6CluSJ
1mSK1mSK1mRq71FKmfevaa1evTq//uu/nqVLl2blypV50YtelBtvvHFefu4lS5Zk//33z9KlS3Po
oYfmz/7sz/Jf//VfO33sYYcdljvvvLP7px0rpwAAwCJX5/FreqWUfPrTn86dd96Zm266KQceeGDe
8IY3zPzTPZhvfvObufPOO3PZZZfloosuyrnnnvuAx9xzzz3z9vy7SzkdqbVr1/ZeAouIPNGaTNGa
TNGaTNHbfvvtlz/8wz/Mxo0bt+9bu3ZtzjvvvO3bF1xwQZ71rGclSf7kT/4kb3nLW+73PY4//vi8
+93vfsjnOuKII/KsZz0r3/72t3P99ddnyZIlOf/88/PoRz86z3ve87bvu/fM6u23355TTz01hxxy
SFauXJkXv/jF27/Xpz/96axZsyYrVqzIM5/5zFxzzTUzvQ5zKacAAAAL5N65zp/97Gf56Ec/mqc/
/enb79vVZcLr1q3LxRdfvP342267LZdddlle/vKXP+Rzbdy4MV/5yldy9NFHb7/vy1/+cq699tpc
eumlD5g1PeWUU/KLX/wiGzduzC233JI//dM/TZJcddVVefWrX51zzz03t99+e17zmtfk+OOPz3/+
53/uwSvxQMrpSJmToCV5ojWZojWZojWZoodaa0488cSsWLEiy5cvz2WXXfaAs6EP5slPfnKWLVuW
yy67LEnykY98JM95znPym7/5mw96zJOe9KSsXLkyxx9/fE477bSceuqp24vo+vXr84hHPCL77bff
/Y656aabcskll+R973tfli1bln333Xf72dv3v//9ec1rXpMnP/nJKaXkla98Zfbbb7989atf3ZOX
4wGUUwAAgAVQSsknP/nJbN26Nb/85S/zd3/3d3n2s5+dW265ZarjX/nKV+bDH/5wkuTDH/5wTjnl
lF0+/qqrrsrtt9+eTZs25W1ve9v97lu1atVOj7nhhhuycuXKLFu27AH3XX/99TnnnHOyYsWK7V83
3nhjbrrppqnW/1CU05EyJ0FL8kRrMkVrMkVrMkVvpZS8+MUvzj777JMrrrgiSfIbv/Eb+elPf7r9
MT/84Q/vd8wrXvGKfPKTn8zVV1+da6+9NieeeOJMz78zq1atyu23354f//jHD7jvsMMOy5//+Z9n
69at27/uuuuunHzyyXu8jrmUUwAAgAVy72W1tdbtZ1Gf+MQnJknWrFmTf/7nf87Pf/7zbNq0Keed
d979SuShhx6a3/3d380rX/nKvOQlL3nAJbktHHzwwXnhC1+Y008/PXfccUfuvvvufPnLX06SnHba
aXnf+96XK6+8MrXW/PSnP81nPvOZ3HXXXU2eWzkdKXMStCRPtCZTtCZTtCZT9PIHf/AHWbp0aZYt
W5a//Mu/zIUXXri9nL75zW/Or/3ar+XAAw/Mqaeemle84hUPOP5Vr3pVrrnmmoe8pHdXv7N0Z/fN
3fdP//RPedjDHpYnPOEJOfDAA/Oe97wnSXLMMcfk3HPPzetf//qsXLkyhx9+eC688MKpfu5p7Nvs
OwEAAAzSgxe1hfS9731vl/cfcMABufTSS++376/+6q/ut/3oRz86q1atyrOf/exdfq9f/epXO92/
evXqB9y3474VK1bkggsu2OnxL3jBC/KCF7xgl8+9p8qOHxvcUymlDmk9AADAeJRSHvBrURaTu+++
Oy996Utz9NFH5y/+4i96L2eXHuzvYrJ/p/9a4LJeAACAgfvOd76TFStW5Oabb84ZZ5zReznzQjkd
KXMStCRPtCZTtCZTtCZTjM0Tn/jE3HXXXbniiiuy//77917OvFBOAQAA6M7MKQAAsCgs9pnTMTFz
CgAAwCgppyNlToKW5InWZIrWZIrWZAqGRzkFAACgOzOnAADAorCYZ06XLFmSTZs25bGPfWzWrVuX
VatW5a//+q9n/r5vf/vb8x//8R8599xzG6zyPmZOAQAA5iilzPvXtK644oo84xnPyPLly3PAAQfk
937v9/L1r399j3+mnbnggguyzz77ZOnSpVm2bFmOPvrofOYzn3nQ73XWWWc1L6Z7at/eC2DPXH75
5Vm7dm3vZbBIyBOtyRStyRStydReZn3/7/2Tn/wkL3rRi/KP//iPOemkk/LLX/4yX/nKV7Lffvvt
0dPu6gzxM5/5zHz5y19OrTV///d/n5NOOik/+MEPsmzZsvs97le/+lX22WefPXr++eDMKQAAwDy7
7rrrUkrJySefnFJKHv7wh+fYY4/NUUcdtf0x559/fo488sisXLkyxx13XL7//e/v0XPdW1xLKTn1
1FPz85//PJs2bcr69evzkpe8JKecckqWLVuWCy64IOvXr88pp5yy/dh7z+6uWLEihx12WD70oQ8l
SX75y1/mLW95Sx796EfnoIMOyute97r84he/mOEVeSDldKT8Sx8tyROtyRStyRStyRQL7Ygjjsg+
++yTdevW5ZJLLsnWrVvvd/8nP/nJvP3tb88nPvGJ3HbbbXnWs56Vl73sZTM95z333JMPfOADWbp0
aR7/+McnST71qU/lj/7oj/LjH/84L3/5y+93efD111+f3//938+b3vSm3HbbbdmwYUPWrFmTJDnz
zDOzadOmXH311dm0aVO2bNmSt73tbTOtb0fKKQAAwDxbunRprrjiipRSctppp+W3fuu3csIJJ+SW
W25Jkrzvfe/LWWedlSOOOCJLlizJWWedlQ0bNuSGG27Y7ef66le/mhUrVuTggw/ORz/60XziE5/I
0qVLkyTPeMYzcvzxxydJHv7wh9/v8uCLLrooxx57bE4++eTss88+WblyZX7nd34ntdace+65ede7
3pXly5dn//33z1lnnZWPfOQjDV6Z+yinI+V3c9GSPNGaTNGaTNGaTNHDE57whHzwgx/MDTfckG99
61v5wQ9+kDPOOCPJtrOWb3rTm7JixYqsWLEiBxxwQJJky5Ytu/08T3va07J169bceuut+dd//dc8
97nP3X7foYce+qDH3XDDDXnsYx/7gP233nprfvazn+WYY47Zvr4XvvCFue2223Z7bbuinAIAACyw
I444Iq961avyrW99K0ly2GGH5f3vf3+2bt26/eunP/1pnva0pzV7zof6dOHDDjss//7v//6A/Y98
5CPziEc8Ihs3bty+tjvuuCM/+clPmq0tUU5Hy5wELckTrckUrckUrckUC+3f/u3f8q53vWv7mdAb
brghF198cZ7+9KcnSV772tfm7LPPzsaNG5MkP/7xj/Pxj398p99rT3+X60Md98d//Mf54he/mI9/
/OO555578qMf/ShXX311lixZktNOOy1nnHFGbr311iTbzuh+/vOf36N1PBjlFAAAYJ4tXbo0X/va
1/LUpz41+++/f57+9Kfnt3/7t3POOeckSU488cS89a1vzUtf+tIsW7YsRx11VC699NLtx88947mr
M6C7e9/cfYcddlg++9nP5pxzzskBBxyQo48+Ot/85jeTJO985zvzuMc9Lk972tOybNmyHHvssbnu
uuv2/AXZ2fr2tHXPh1JKHdJ6hszv5qIleaI1maI1maI1mVqcSikPODu4q8tYW9FhHmhnfxdz9u/0
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
NuMCAAybcgqwKAytCA6zMAMAw+Wy3pEyz0VL8gQAQG/KKQAAAN0ppyNlRpCW5AkAgN6UUwAAALpT
TkfKjCAblWGKAAAgAElEQVQtyRMAAL0ppwAAAHSnnI6UGUFakicAAHpTTgEAAOhOOR0pM4K0JE8A
APSmnAIAANCdcjpSZgRpSZ4AAOhNOQUAAKA75XSkzAjSkjwBANDbvr0XAPT3nOc8p/cSHlSttfcS
AABYAMrpSJkRpLn1vRewE+t7LwAAgIXisl4AAAC6U05HyowgAACwmCinAAAAdKecjpSZUwAAYDFR
TgEAAOhOOR0pM6cAAMBiopwCAADQnXI6UmZOAQCAxUQ5BQAAoDvldKTMnAIAAIuJcgoAAEB3yulI
mTkFAAAWE+UUAACA7pTTkTJzCgAALCbKKQAAAN0ppyNl5hQAAFhMlFMAAAC6U05HyswpAACwmDxk
OS2lnF9KubmUcs2cfStLKV8opVxXSvl8KWX5nPvOKqV8t5RybSnl+XP2H1NKuWZy39+2/1EAAAAY
q2nOnH4wyXE77DszyRdqrY9PctlkO6WUI5OcnOTIyTHvLaWUyTH/kOTVtdbDkxxeStnxe7IbzJwC
AACLyUOW01rrV5Js3WH38Uk+NLn9oSQnTm6fkOTiWuvdtdbNSTYleWop5eAkS2utV04ed+GcYwAA
ANjL7enM6YG11psnt29OcuDk9qOS3DjncTcmOWQn+7dM9rOHzJwCAACLycwfiFRrrUlqg7UAAACw
l9p3D4+7uZRyUK31h5NLdm+Z7N+SZNWcxx2abWdMt0xuz92/ZWffeN26dVm9enWSZPny5VmzZs32
+cp7zxbaXpu1a9cOaj22x7+d7237I4/JsLYner8+Q99OLp/8OZTtbWscyutje3Fsb+f9aZTb97l3
e23n7dxvfb1fH9uLY3sw70/3bqf/f483bNiQO+64I0myefPm7ErZduJz10opq5P8S631qMn23yT5
Ua31naWUM5Msr7WeOflApIuSPCXbLtv9YpLH1VprKeVrSd6Y5Mokn0nynlrrJTs8T51mPUBbpZRk
fe9V7MT6xHvCQ9v2uXNDe52KvzuaGuT71HrvUdPyPsXewPvUdEopqbWWnd23ZIqDL07yr0mOKKXc
UEo5Nck7khxbSrkuyXMn26m1bkzysSQbk3wuyelz2ubpST6Q5LtJNu1YTNk9D/xXSAAAgPF6yMt6
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
YTQX7JRa2wKsr6qdt/4CbukdTqO0fVXdC1BVdzK5u/VTwCeBHXsG02jtlOR5SQ4EdqiquwGGnvks
8+Pgbx9n358DG5NcBzyLyXJekvwMcEXPYBqlDcCHk+zM5LlAmCzBvGs4Jy3XBuyU2vo4sBew1Mvs
z1jhLJoP/5Pk5VV1MUBV/Qh4U5I/A36tbzSN1K3A+4fj25I8tar+N8la4N6OuUbPZb0jMNw5fTqT
JXJ39s6j8UuyOw9sXrO5qrwbocfFTkmaVUl2Aqiqh6zmSLJnVX37od8lLV+S7YEnVNX3e2cZKyen
IzA8u/UC4KnD0GbgMncCU0tJ9q2qa3vn0PywU2rNTqk1O6XW7NTj4+R0xiV5FXAqcD0PXjK3Hnhz
VZ3fK5vmi7tgqjU7pdbslFqzU2rNTj0+PnM6+04BXrH4nVwASZ4GfA7Yt0cojVOSv3qE06tXLIjm
hp1Sa3ZKrdkptWanpsc7pzNu2Ahpv4Vd5haN7whc42satBzDKxpOAH4ILP7HH+D9VbXrkt8oPQw7
pdbslFqzU2rNTk2Pd05n32nA5UnO4IFlveuAo4dz0nJ8Bbi6qr649Ykk7175OJoDdkqt2Sm1ZqfU
mp2aEu+cjkCS/YDDefCGSOdW1TX9UmmMkqwB7nEXObVip9SanVJrdkqt2anpcXIqSZIkSepuu94B
9MiSrE5yUpJrk2xJcsdwfFISH7jWstgntWan1JqdUmt2Sq3Zqelxcjr7zgK2AAcDa6pqDXAIcOdw
TloO+6TW7JRas1NqzU6pNTs1JS7rnXFJvlFVz1zuOWkp9kmt2Sm1ZqfUmp1Sa3ZqerxzOvtuSvK2
JE9ZGEiyW5K3A9/qmEvjZJ/Ump1Sa3ZKrdkptWanpsTJ6ex7PbAWuHhY074FuAjYFTiqZzCNkn1S
a3ZKrdkptWan1JqdmhKX9UqSJEmSuvPO6Qgk2TfJoUmetNX4Yb0yabzsk1qzU2rNTqk1O6XW7NR0
ODmdcUmOA84B/hD4apIjFp0+sU8qjZV9Umt2Sq3ZKbVmp9SanZqeVb0D6FH9DnBgVd2dZB/gU0n2
qaoP9Y2lkbJPas1OqTU7pdbslFqzU1Pi5HT2paruBqiqG5McDHw6yd5AuibTGNkntWan1JqdUmt2
Sq3ZqSlxWe/s+06Sn1v4w/AP4VeZ7Aa2f7dUGiv7pNbslFqzU2rNTqk1OzUl7tY745KsA+6tqlu3
Gg/w4qq6pE8yjZF9Umt2Sq3ZKbVmp9SanZoeJ6eSJEmSpO5c1itJkiRJ6s7JqSRJkiSpOyenkiRJ
kgBQsyQAAAAZSURBVKTunJxKkiRJkrpzcipJkiRJ6u7/Ac4jdQB5UqR7AAAAAElFTkSuQmCC
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br></p>
<h1 id="my-portfolio">My Portfolio</h1>
<p><br></p>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[12]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">myStocks</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;KBWY&#39;</span><span class="p">,</span> <span class="s">&#39;PJP&#39;</span><span class="p">,</span> <span class="s">&#39;SCHG&#39;</span><span class="p">,</span> <span class="s">&#39;VEA&#39;</span><span class="p">,</span> <span class="s">&#39;VGLT&#39;</span><span class="p">,</span> <span class="s">&#39;VIOG&#39;</span><span class="p">,</span> <span class="s">&#39;VO&#39;</span><span class="p">,</span> <span class="s">&#39;VWO&#39;</span><span class="p">]</span>
<span class="n">KBWY</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;KBWY&#39;</span><span class="p">]</span>
<span class="n">PJP</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;PJP&#39;</span><span class="p">]</span>
<span class="n">SCHG</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;SCHG&#39;</span><span class="p">]</span>
<span class="n">VEA</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VEA&#39;</span><span class="p">]</span>
<span class="n">VGLT</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VGLT&#39;</span><span class="p">]</span>
<span class="n">VIOG</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VIOG&#39;</span><span class="p">]</span>
<span class="n">VO</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VO&#39;</span><span class="p">]</span>
<span class="n">VWO</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VWO&#39;</span><span class="p">]</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[13]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">KBWY</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
KBWY Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2011-02-14 00:00:00
Account Value: 10000
	Buy Price: 21.23
	Num Shares: 471.0
	Remaining Value: 0.67
Sell Date: 
2011-08-12 00:00:00
	Sell Price: 18.24
	Updated Value: 8591.71

-------------------------

Buy Date: 
2012-01-25 00:00:00
Account Value: 8591.71
	Buy Price: 21.59
	Num Shares: 397.0
	Remaining Value: 20.48
Sell Date: 
2013-09-05 00:00:00
	Sell Price: 26.71
	Updated Value: 10624.35

-------------------------

Buy Date: 
2013-11-12 00:00:00
Account Value: 10624.35
	Buy Price: 28.06
	Num Shares: 378.0
	Remaining Value: 17.67
Sell Date: 
2013-11-14 00:00:00
	Sell Price: 28.51
	Updated Value: 10794.45

-------------------------

Buy Date: 
2014-02-28 00:00:00
Account Value: 10794.45
	Buy Price: 29.88
	Num Shares: 361.0
	Remaining Value: 7.77
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 35.65
	Updated Value: 12877.42


===============================

KBWY:
Final Value Basic: 17825.0
Final Value Crossover: 12877.42




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[14]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[14]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/282.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[15]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,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
KJpDmdbrrSeB7Pomv371nN2v/uqvZuPGjdm0aVP+8A//MO9+97sXiuZrXvOa3P/+98+xxx6bc845
Jy95yUsOevzLXvayXH311YteNnukv4l5qPv2ve0973lP7ne/++WRj3xkjj322PzZn/1ZkuRxj3tc
Lrroovz2b/92tmzZkoc//OF597vfvaTXva+e80N+PZNd36Y1vw1rvQEAOLLDF6/Vcv311x/x/mOO
OSaXXXbZfre9/vWv32/90Ic+NCeccEKe9rSnHfFr/ehHPzrk7Vu3bj3ovgNv27x5cy655JJDPv4Z
z3hGnvGMZxzxuQGglXLgr0Zv+sVLqaP8+gBMjlLKQX+uY1L88Ic/zAte8IKccsop+YM/+IO13s4R
TXIOALQ3+Llx0P8VduksAIzQV7/61WzevDm33nprzjvvvLXeDgCsCkVzCNN6vfUkkF3f5Nevaczu
UY96VO6+++5cccUVOfroo9d6O0OZxvwmifz6Jbu+TWt+iiYAAABNmdEEYCyYDRwPcgBgOcxoAgAA
sCoUzSFM6/XWk0B2fZNfv2TXN/n1TX79kl3fpjU/RRMAAICmzGgCMBYmdTZw3bp12bVrVx72sIdl
27ZtOeGEE/LHf/zHQ3/dN77xjfn3f//3XHTRRQ12eZ9JzQGA0TCjCUB3Sikjf1uKK664Ik960pMy
MzOTY445Jk95ylPyxS9+ccWv51AuueSSrF+/Phs3bsymTZtyyimn5BOf+MRhv9YFF1zQvGQCQCsb
1noDPduxY0fm5ubWehusgOz6Jr9+rSi77aPYydK/9re//e08+9nPzl//9V/n+c9/fn7wgx/ks5/9
bI466qgVPeWRzhY++clPzmc+85nUWvMXf/EXef7zn5+vf/3r2bRp036f96Mf/Sjr169f0fMPw7HX
N/n1S3Z9m9b8nNEEgCO47rrrUkrJWWedlVJKHvCAB+S0007LYx7zmIXPufjii/PoRz86W7Zsyemn
n56vfe1rK3que0toKSXnnHNOvve972XXrl3Zvn17nve85+Xss8/Opk2bcskll2T79u05++yzFx57
71nXzZs358QTT8yll16aJPnBD36Q1772tXnoQx+aBz/4wfnN3/zNfP/73x/iOwIAi1M0hzCN/2di
Usiub/LrV4/ZnXzyyVm/fn22bduWT37yk9mzZ89+93/kIx/JG9/4xnz4wx/O7bffnqc+9al54Qtf
ONRz3nPPPXnHO96RjRs35hGPeESS5KMf/Wh+/dd/PXfeeWde/OIX73cJ7g033JBnPetZefWrX53b
b789O3fuzOzsbJLk/PPPz65du3LVVVdl165dufnmm/OGN7xhRfvqMT/uI79+ya5v05qfogkAR7Bx
48ZcccUVKaXk3HPPzU//9E/nOc95Tm677bYkydve9rZccMEFOfnkk7Nu3bpccMEF2blzZ2688cZl
P9fnPve5bN68Occdd1w++MEP5sMf/nA2btyYJHnSk56UM844I0nygAc8YL9LcN/3vvfltNNOy1ln
nZX169dny5Yt+fmf//nUWnPRRRflLW95S2ZmZnL00UfnggsuyAc+8IEG3xkAODxFcwjT+jdxJoHs
+ia/fvWa3SMf+ci8613vyo033pgvf/nL+frXv57zzjsvyfzZxFe/+tXZvHlzNm/enGOOOSZJcvPN
Ny/7eZ7whCdkz549+eY3v5l/+Zd/yS//8i8v3Hf88ccf9nE33nhjHvawhx10+ze/+c1897vfzeMe
97iF/T3zmc/M7bffvuy9Jf3mxzz59Ut2fZvW/BRNAFiGk08+OS972cvy5S9/OUly4okn5u1vf3v2
7Nmz8Pad73wnT3jCE5o952K/IffEE0/Mv/3bvx10+4Me9KA88IEPzDXXXLOwt7179+bb3/52s70B
wKEomkOY1uutJ4Hs+ia/fvWY3b/+67/mLW95y8IZyhtvvDHvf//788QnPjFJ8opXvCJ/8id/kmuu
uSZJcuedd+ZDH/rQIb/WSv8+5WKPe9GLXpR//Md/zIc+9KHcc889+da3vpWrrroq69aty7nnnpvz
zjsv3/zmN5PMn2n91Kc+taJ99Jgf95Ffv2TXt2nNT9EEgCPYuHFjPv/5z+eXfumXcvTRR+eJT3xi
fu7nfi4XXnhhkuTMM8/M6173urzgBS/Ipk2b8pjHPCaXXXbZwuP3PRN5pDOTy71v39tOPPHE/P3f
/30uvPDCHHPMMTnllFPypS99KUny5je/OT/7sz+bJzzhCdm0aVNOO+20XHfddSv/hgDAEpSV/t/V
JX3xUuoov/5am9a/iTMJZNc3+fXrSNmVUg46c3eky0VbmeSfUytxqBzu5djrm/z6Jbu+TXp+g58b
B/3A3rAWmwGApVACAaBPzmgCMBaOdCaN1SMHAJbjcGc0zWgCAADQlKI5hGn9mziTQHZ9k1+/ZNc3
+fVNfv2SXd+mNT9FEwAAgKbMaAIwFswGjgc5ALAcfussAGNvNf6cCQAwei6dHcK0Xm89CWTXN/n1
60jZ1Vq9jcnbSvJj/MmvX7Lr27Tmp2gCAADQlBlNAAAAVsTf0QQAAGBVKJpDmNbrrSeB7Pomv37J
rm/y65v8+iW7vk1rfoomAAAATZnRBAAAYEXMaAIAALAqFM0hTOv11pNAdn2TX79k1zf59U1+/ZJd
36Y1P0UTAACApsxoAgAAsCJmNAEAAFgViuYQpvV660kgu77Jr1+y65v8+ia/fsmub9Oan6IJAABA
U2Y0AQAAWBEzmgAAAKwKRXMI03q99SSQXd/k1y/Z9U1+fZNfv2TXt2nNT9EEAACgKTOaAAAArIgZ
TQAAAFaFojmEab3eehLIrm/y65fs+ia/vsmvX7Lr27Tmp2gCAADQlBlNAAAAVsSMJgAAAKtC0RzC
tF5vPQlk1zf59Ut2fZNf3+TXL9n1bVrz27DWGwAAAJhUp5566qo/5ziML5rRBAAAGJFSSrJ9FZ9w
++oWTTOaAAAArApFcwjTer31JJBd3+TXL9n1TX59k1+/ZEePFE0AAACaMqMJAAAwImY0D//AB5RS
Pl9K2VlKuaaU8sbB7dtLKTeVUq4cvJ0+io0DAADQl0WLZq31+0lOrbXOJvm5JKeWUp6SpCZ5S631
lMHbJ0e817Hjevl+ya5v8uuX7Pomv77Jr1+yo0dLmtGstX538OH9k6xPsmewPugUKQAAANNtSTOa
pZR1Sf5Xkv+U5K9qrb9XSnl9knOS3Jnki0l+t9a694DHmdEEAACmlhnNI6i1/nhw6ezxSf73Uspc
kr9KclKS2SS3JLmw3XYBAADo1YblfHKt9c5SyieS/EKtdce9t5dS3pHkY4d6zLZt27J169YkyczM
TGZnZzM3N5fkvuvNe12/9a1vnajXM03rfWcdxmE/1vKblvW9t43LfqyXt773tnHZj/Xy1vfeNi77
sV76eufOnTnvvPPGZj/WKzv+kiTXD96fNOL1wKj+Pe7dO38h6+7du3M4i146W0p5UJJ7aq17SykP
THJZkj9K8pVa6zcGn/OaJI+vtb7ogMdO9KWzO3bsWPim0xfZ9U1+/ZJd3+TXN/n1S3Z9m9ZLZ5dS
NB+T5NLMX2a7Lsl7aq3/tZTy7sxfNlsz351fXmu99YDHTnTRBAAAOJJpLZqLXjpba706yWMPcftL
G+0NAACACbJurTfQs4OuuaYbsuub/Polu77Jr2/y65fs6JGiCQAAQFNL+juaK/7iZjQBAIApNq0z
ms5oAgAA0JSiOQTXy/dLdn2TX79k1zf59U1+/ZIdPVI0AQAAaMqMJgAAwIiY0QQAAIAGFM0huF6+
X7Lrm/z6Jbu+ya9v8uuX7OiRogkAAEBTZjQBAABGxIwmAAAANKBoDsH18v2SXd/k1y/Z9U1+fZNf
v2RHjxRNAAAAmjKjCQAAMCJmNAEAAKABRXMIrpfvl+z6Jr9+ya5v8uub/PolO3qkaAIAANCUGU0A
AIARMaMJAAAADSiaQ3C9fL9k1zf59Ut2fZNf3+TXL9nRI0UTAACApsxoAgAAjIgZTQAAAGhA0RyC
6+X7Jbu+ya9fsuub/Pomv37Jjh4pmgAAADRlRhMAAGBEzGgCAABAA4rmEFwv3y/Z9U1+/ZJd3+TX
N/n1S3b0SNEEAACgKTOaAAAAI2JGEwAAABpQNIfgevl+ya5v8uuX7Pomv77Jr1+yo0eKJgAAAE2Z
0QQAABgRM5oAAADQgKI5BNfL90t2fZNfv2TXN/n1TX79kh09UjQBAABoyowmAADAiJjRBAAAgAYU
zSG4Xr5fsuub/Polu77Jr2/y65fs6JGiCQAAQFNmNAEAAEbEjCYAAAA0oGgOwfXy/ZJd3+TXL9n1
TX59k1+/ZEePFE0AAACaMqMJAAAwImY0AQAAoAFFcwiul++X7Pomv37Jrm/y65v8+iU7eqRoAgAA
0JQZTQAAgBExowkAAAANKJpDcL18v2TXN/n1S3Z9k1/f5Ncv2dEjRRMAAICmzGgCAACMiBlNAAAA
aEDRHILr5fslu77Jr1+y65v8+ia/fsmOHimaAAAANGVGEwAAYETMaAIAAEADiuYQXC/fL9n1TX79
kl3f5Nc3+fVLdvRI0QQAAKApM5oAAAAjYkYTAAAAGlA0h+B6+X7Jrm/y65fs+ia/vsmvX7KjR4om
AAAATZnRBAAAGBEzmgAAANCAojkE18v3S3Z9k1+/ZNc3+fVNfv2SHT1SNAEAAGjKjCYAAMCImNEE
AACABhTNIbhevl+y65v8+iW7vsmvb/Lrl+zokaIJAABAU2Y0AQAARsSM5qEf9IBSyudLKTtLKdeU
Ut44uH1LKeXTpZTrSimfKqXMjGrjAAAA9OWIRbPW+v0kp9ZaZ5P8XJJTSylPSXJ+kk/XWh+R5PLB
euq4Xr5fsuub/Polu77Jr2/y65fs6NGiM5q11u8OPrx/kvVJ9iQ5I8mlg9svTXLmSHYHAABAdxad
0SylrEvyv5L8pyR/VWv9vVLKnlrr5sH9Jckd964PeKwZTQAAYGpN64zmhsUeWGv9cZLZUsqmJJeV
Uk494P5aSjnsK9m2bVu2bt2aJJmZmcns7Gzm5uaS3HcZgLW1tbW1tbW1tbW19aSuF1w/eH/SiNcD
o3g9O3fuzN69e5Mku3fvzuEs67fOllL+MMn3kvwfSeZqrd8opRyX5J9qrY88xOdP9BnNHTt2LHzT
6Yvs+ia/fsmub/Lrm/z6Jbu+OaN56Ac9KMk9tda9pZQHJjktyR8l+WiSlyV58+D937XfMgAAjJ/5
ybHVNcknb5hMRzyjWUp5TOZ/2c+6wdt7aq3/tZSyJcnfJDkxye4kz6+17j3E4yf6jCYAANNnvmiu
5n/jFkWzY85oHkKt9eokjz3E7XckeXq77QEAADAp1q31Bnp20HAv3ZBd3+TXL9n1TX59kx+wmhRN
AAAAmlrWb51d9hc3owkAwIQxo8lyTOuMpjOaAAAANKVoDsGsQ79k1zf59Ut2fZNf3+QHrCZFEwAA
gKbMaAIAwDKY0WQ5zGgCAABAA4rmEMw69Et2fZNfv2TXN/n1TX7AalI0AQAAaMqMJgAALIMZTZbD
jCYAAAA0oGgOwaxDv2TXN/n1S3Z9k1/f5AesJkUTAACApsxoAgDAMpjRZDnMaAIAAEADiuYQzDr0
S3Z9k1+/ZNc3+fVNfsBqUjQBAABoyowmAAAsgxlNlsOMJgAAADSgaA7BrEO/ZNc3+fVLdn2TX99K
Kav6Bky3DWu9AQAAVsn2CXseYGyZ0QQAmAKrOie2fXVnxFabGU2Ww4wmAAAANKBoDsGsSr9k1zf5
9Ut2fZMfAEulaAIAANCUGU0AgClgRrMdM5oshxlNAAAAaEDRHIJZlX7Jrm/y65fs2lrtv4vobyMC
sFT+jiYAdG11L98DgKUwowkAnTInxnKY0WzHscdymNEEAACABhTNIZg16pfs+ia/fskOAKaDogkA
AEBTZjQBoFPmxFgOM5rtOPZYDjOaAAAA0ICiOQSzRv2SXd/k1y/ZAcB0UDQBAABoyowmAHTKnBjL
YUazHccey2FGEwAAABpQNIdg1qhfsuub/PolOwCYDoomAAAATZnRBIBOmRNjOcxotuPYYznMaAIA
AEADiuYQzBr1S3Z9k1+/ZAcA00HRBAAAoCkzmgDQKXNiLIcZzXYceyyHGU0AAABoQNEcglmjfsmu
b/Lrl+wAYDoomgAAADRlRhOAVTM/17S6JvnnkDkxlsOMZjuOPZZjWmc0N6zaDgAgWfUftgDA6nPp
7BDMGvVLdn2THwDAeFM0AQAAaErRHMLc3Nxab4EVkl3f5AcAMN4UTQAAAJpSNIdgTqxfsuub/AAA
xpuiCQAAQFOK5hDMifVLdn2THwDAeFM0AQAAaErRHII5sX7Jrm/yAwAYb4omAAAATSmaQzAn1i/Z
9U1+AADjTdEEAACgKUVzCObE+iW7vskPAGC8KZoAAAA0pWgOwZxYv2TXN/kBAIw3RRMAAICmFM0h
mBPrl+z6Jj8AgPGmaAIAANCUojkEc2L9kl3f5AcAMN4UTQAAAJpSNIdgTqxfsuub/AAAxpuiCQAA
QFOLFs1SygmllH8qpXyllPLlUsp/Gdy+vZRyUynlysHb6aPf7ngxJ9Yv2fVNfgAA423DEj7nh0le
U2vdWUo5Osn/W0r5dJKa5C211reMdIcAAAB0ZdEzmrXWb9Radw4+vjvJV5M8ZHB3GeHexp45sX7J
rm/yAwAYb8ua0SylbE1ySpLPDW56VSnlqlLKO0spM433BgAAQIeWXDQHl83+9ySvHpzZ/KskJyWZ
TXJLkgtHssMxZk6sX7Lrm/wAAMbbUmY0U0q5X5L/keS9tda/S5Ja62373P+OJB871GO3bduWrVu3
JklmZmYyOzu78B+J917+Zm1tbW09HesF1w/enzTi9cC4vP6RfT9z73puxOsMtV/rtV0vcPw1We/z
Cgfv50a8zlD7tV7b9YIJOP527tyZvXv3Jkl2796dwym11sPemSSllJLk0iTfqrW+Zp/bj6u13jL4
+DVJHl9rfdEBj62Lff2e7dixY+GbTl9k1zf59auUkmxfxSfcnkzyz6H5H9Gr+frKRH8/J92qHn/b
HXuNn3Giv5+TbtJ/9pVSUms96Hf3LOWM5pOTvCTJl0opVw5u+7+SvLCUMpv5o+z6JC9vtVkAAAD6
tWjRrLVekUPPcv5D++30xRmVfsmub/IDABhvhyqQAAAAsGKK5hAOHganF7Lrm/wAAMabogkAAEBT
iuYQzIn1S3Z9kx8AwHhTNAEAAGhK0RyCObF+ya5v8gMAGG+KJgAAAE0pmkMwJ9Yv2fVNfgAA403R
BAAAoClFcwjmxPolu77JDwBgvCmaAAAANKVoDsGcWL9k1zf5AQCMN0UTAACAphTNIZgT65fs+iY/
AIDxpmgCAADQlKI5BHNi/ZJd3+QHADDeFE0AAACaUjSHYE6sX7Lrm/wAAMabogkAAEBTiuYQzIn1
S3Z9kx8AwHhTNAEAAGhK0RyCObF+ya5v8gMAGG+KJgAAAE0pmkMwJ9Yv2fVNfgAA403RBAAAoClF
cwjmxPolu77JDwBgvCmaAAAANKVoDsGcWL9k1zf5AQCMN0UTAACAphTNIZgT65fs+iY/AIDxpmgC
AADQlKI5BHNi/ZJd3+QHADDeFE0AAACaUjSHYE6sX7Lrm/wAAMabogkAAEBTiuYQzIn1S3Z9kx8A
wHhTNAEAAGhK0RyCObF+ya5v8gMAGG+KJgAAAE0pmkMwJ9Yv2fVNfgAA403RBAAAoClFcwjmxPol
u77JDwBgvCmaAAAANKVoDsGcWL9k1zf5AQCMN0UTAACAphTNIZgT65fs+iY/AIDxpmgCAADQlKI5
BHNi/ZJd3+QHADDeFE0AAACaUjSHYE6sX7Lrm/wAAMabogkAAEBTiuYQzIn1S3Z9kx8AwHhTNAEA
AGhK0RyCObF+ya6tUsqqvwEAML42rPUGgElRV/G5FE0AgHHmjOYQzIn1S3YAADA6iiYAAABNKZpD
MOfXL9kBAMDoKJoAAAA0NVG/DGgtfhNlrav5C1BoxYwmAACMzkQVzXl+8yUAAMBacuksU8mMJgAA
jI6iCQAAQFOKJlPJjCYAAIyOogkAAEBTiiZTyYwmAACMjqIJAABAU4omU8mMJgAAjI6iCQAAQFOK
JlPJjCYAAIyOogkAAEBTiiZTyYwmAACMjqIJAABAU4omU8mMJgAAjI6iCQAAQFOLFs1SygmllH8q
pXyllPLlUsp/Gdy+pZTy6VLKdaWUT5VSZka/XWjDjCYAAIzOUs5o/jDJa2qt/znJE5L8VinlUUnO
T/LpWusjklw+WAMAADDlFi2atdZv1Fp3Dj6+O8lXkzwkyRlJLh182qVJzhzVJqE1M5oAADA6y5rR
LKVsTXJKks8nObbWeuvgrluTHNt0ZwAAAHRpyUWzlHJ0kv+R5NW11rv2va/WWpPUxnuDkTGjCQAA
o7NhKZ9USrlf5kvme2qtfze4+dZSyoNrrd8opRyX5LZDPXbbtm3ZunVrkmRmZiazs7ML/5F/7+WL
rdbzdiSZ2+fjjHA9v4dRvR5r657Woz/e9l+v9eu1Xtl6wfWD9yeNeD0wLq9/ZN/PVTv+MtR+rdd2
vcDx12RZMQc0AAAgAElEQVS9zyscvJ8b8TpD7dd6bdcLJuD427lzZ/bu3Zsk2b17dw6nzJ+MPLxS
Ssn8DOa3aq2v2ef2Px3c9uZSyvlJZmqt5x/w2LrY129pfqureWK1ZDVfH+3s2LFj4YBheI49lqqU
kmxfxSfcnon+t+LYYzlW9fjb7thr/IwT/f2cdJP+s6+UklprOfD2pZzRfHKSlyT5UinlysFtFyR5
U5K/KaX8RpLdSZ7faK8AAAB0bNGiWWu9Ioef5Xx62+3A6nA2EwAARudwBRIAAABWRNFkKh08yA8A
ALSiaAIAANCUoslUMqMJAACjo2gCAADQlKLJVDKjCQAAo6NoAgAA0JSiyVQyowkAAKOjaAIAANCU
oslUMqMJAACjo2gCAADQlKLJVDKjCQAAo6NoAgAA0JSiyVQyowkAAKOjaAIAANCUoslUMqMJAACj
o2gCAADQlKLJVDKjCQAAo6NoAgAA0JSiyVQyowkAAKOjaAIAANCUoslUMqMJAACjo2gCAADQlKLJ
VDKjCQAAo6NoAgAA0NSGtd4ArIVSyqo/Z6111Z8TAADWgqLJ9No+oc8FAABrzKWzAAAANKVoAgAA
0JSiCQAAQFOKJgAAAE0pmgAAADSlaAIAANCUogkAAEBTiiYAAABNKZoAAAA0pWgCAADQlKIJAABA
U4omAAAATSmaAAAANKVoAgAA0JSiCQAAQFOKJgAAAE0pmgAAADSlaAIAANCUogkAAEBTiiYAAABN
KZoAAAA0pWgCAADQlKIJAABAU4omAAAATSmaAAAANKVoAgAA0JSiCQAAQFOKJgAAAE0pmgAAADSl
aAIAANCUogkAAEBTiiYAAABNKZoAAAA0pWgCAADQlKIJAABAU4omAAAATSmaAAAANKVoAgAA0JSi
CQAAQFOKJgAAAE0pmgAAADSlaAIAANCUogkAAEBTiiYAAABNKZoAAAA0pWgCAADQlKIJAABAU4om
AAAATS1aNEspF5dSbi2lXL3PbdtLKTeVUq4cvJ0+2m0CAADQi6Wc0XxXkgOLZE3yllrrKYO3T7bf
GgAAAD1atGjWWj+bZM8h7irttwMAAEDvhpnRfFUp5apSyjtLKTPNdgQAAEDXNqzwcX+V5A2Dj/84
yYVJfuNQn7ht27Zs3bo1STIzM5PZ2dnMzc0lSXbs2JEkzdbzdiSZ2+fjjHA9v4dRvR7r0a5z/fy7
nJRVWa/16x3593Pkx9v+67V+vdYrWy9YreNvYFxe/8i+n6t2/GWo/Vqv7XqB46/Jep9XOHg/N+J1
htqv9dquF0zA8bdz587s3bs3SbJ79+4cTqm1HvbOhU8qZWuSj9VaH7PM++pSvn4rpZTMj4+u2jNm
NV8f7ZRSku2r+ITbM9H/Vhx7LJVjry3HHsuxqsffdsde42ec6O/npJv0n32llNRaDxqrXLfCL3bc
PsvnJrn6cJ8LAADAdFn00tlSyvuTPC3Jg0opNyZ5fZK5Usps5v9XzvVJXj7SXQIAANCNRYtmrfWF
h7j54hHsBQAAgAmwoktnAQAA4HAUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABo
StEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKAp
RRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYU
TQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0
AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEE
AACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMA
AICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAA
AJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAA
aErRBAAAoClFEwAAgKYUTQAAAJpatGiWUi4updxaSrl6n9u2lFI+XUq5rpTyqVLKzGi3CQAAQC+W
ckbzXUlOP+C285N8utb6iCSXD9YAAACweNGstX42yZ4Dbj4jyaWDjy9NcmbjfQEAANCplc5oHltr
vXXw8a1Jjm20HwAAADo39C8DqrXWJLXBXgAAAJgAG1b4uFtLKQ+utX6jlHJcktsO94nbtm3L1q1b
kyQzMzOZnZ3N3NxckmTHjh1J0mw9b0eSuX0+zgjX83sY1euxHu0618+/y0lZlfVav96Rfz9Hfrzt
v17r12u9svWC1Tr+Bsbl9Y/s+7lqx1+G2q/12q4XOP6arPd5hYP3cyNeZ6j9Wq/tesEEHH87d+7M
3r17kyS7d+/O4ZT5E5JHVkrZmuRjtdbHDNZ/muRbtdY3l1LOTzJTaz3oFwKVUupSvn4rpZSs7snV
ktV8fbRTSkm2r+ITbs9E/1tx7LFUjr22HHssx6oef9sde42fcaK/n5Nu0n/2lVJSay0H3r5uCQ98
f5J/SXJyKeXGUso5Sd6U5LRSynVJfnmwBgAAgMUvna21vvAwdz298V4AAACYAIue0QQAAIDlUDQB
AABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQA
AKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAA
gKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAA
mlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABo
StEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKAp
RRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYU
TQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0
AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEE
AACgqQ3DPLiUsjvJt5P8KMkPa62/2GJTAAAA9GuoopmkJpmrtd7RYjMAAAD0r8Wls6XB1wAAAGBC
DFs0a5J/LKV8sZRybosNAQAA0LdhL519cq31llLKTyX5dCnl2lrrZ1tsDAAAgD4NVTRrrbcM3n+z
lPLhJL+YZL+iuW3btmzdujVJMjMzk9nZ2czNzSVJduzYkSTN1vN2JJnb5+OMcD2/h1G9HuvRrnP9
/LuclFVZr/XrHfn3c+TH2/7rtX691itbL1it429gXF7/yL6fq3b8Zaj9Wq/teoHjr8l6n1c4eD83
4nWG2q/12q4XTMDxt3PnzuzduzdJsnv37hxOqbUe9s4jKaX8RJL1tda7Sik/meRTSf6o1vqpfT6n
rvTrr3BPmb+ad9WeMav5+minlJJsX8Un3J6J/rfi2GOpHHttOfZYjlU9/rY79ho/40R/PyfdpP/s
K6Wk1nrQ7+0Z5ozmsUk+PH+gZUOS/2ffkgkAAMB0WnHRrLVen2S24V4AAACYAOvWegMAAABMFkUT
AACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0A
AACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEA
AGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAA
oClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACA
phRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACa
UjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK
0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClF
EwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRN
AAAAmhqqaJZSTi+lXFtK+f9KKa9rtSkAAAD6teKiWUpZn+T/TnJ6kkcneWEp5VGtNgYAAECfhjmj
+YtJdtVad9daf5jkA0me02ZbAAAA9GqYovmQJDfus75pcBsAAABTrNRaV/bAUn4tyem11nMH65ck
+aVa66v2+ZyVfXEAAAC6UGstB962YYivd3OSE/ZZn5D5s5pHfEIAAAAm2zCXzn4xycNLKVtLKfdP
claSj7bZFgAAAL1a8RnNWus9pZTfTnJZkvVJ3llr/WqznQEAANClFc9oAgAAwKEMM6M5VUop6zL/
J10ekqRmfkb1C1VTH3uy65v8+iW7vsmvb/Lrl+z6Jr/7OKO5BKWUX0nyl0l25b5feHR8kocneWWt
9bK12htHJru+ya9fsuub/Pomv37Jrm/y25+iuQSllGsz/6dcdh9w+0lJ/qHW+sg12RiLkl3f5Ncv
2fVNfn2TX79k1zf57W+Y3zo7TdZn/rT3gW6Oy4/Hnez6Jr9+ya5v8uub/Polu77Jbx9T94JX6OIk
/7OU8v7cdxr8hCQvGNzH+JJd3+TXL9n1TX59k1+/ZNc3+e3DpbNLVEp5dJLnJPmZwU03J/lorfWa
tdsVSyG7vsmvX7Lrm/z6Jr9+ya5v8ruPogkAAEBTZjSXoJQyU0p5Uynl2lLKnlLKHYOP31RKmVnr
/XF4suub/Polu77Jr2/y65fs+ia//SmaS/M3SfYkmUuypda6JcmpSfYO7mN8ya5v8uuX7Pomv77J
r1+y65v89uHS2SUopVxXa33Ecu9j7cmub/Lrl+z6Jr++ya9fsuub/PbnjObS3FBK+b1SyrH33lBK
eXAp5XVJvraG+2Jxsuub/Polu77Jr2/y65fs+ia/fSiaS3NWkgcl+efB9dZ7kuxIckyS56/lxliU
7Pomv37Jrm/y65v8+iW7vslvHy6dBQAAoClnNJeplPLYA9aPW6u9sDyy65v8+iW7vsmvb/Lrl+z6
Jj9FcyV+84D1K9ZkF6yE7Pomv37Jrm/y65v8+iW7vk19fi6dBQAAoKkNa72BXpRS1iX5xSQ/M7jp
5iRfqJr62JNd3+TXL9n1TX59k1+/ZNc3+d3HGc0lKKX8SpK/TLIryU2Dm49P8vAkr6y1XrZWe+PI
ZNc3+fVLdn2TX9/k1y/Z9U1++1M0l6CUcm2S02utuw+4/aQk/1BrfeSabIxFya5v8uuX7Pomv77J
r1+y65v89ueXAS3N+syf9j7QzXH58biTXd/k1y/Z9U1+fZNfv2TXN/ntY+pe8ApdnOR/llLen/tO
g5+Q5AWD+xhfsuub/Polu77Jr2/y65fs+ia/fbh0dolKKY9O8pzsP9j70VrrNWu3K5ZCdn2TX79k
1zf59U1+/ZJd3+R3H0UTAACApsxoLkEpZaaU8qZSyrWllD2llDsGH7+plDKz1vvj8GTXN/n1S3Z9
k1/f5Ncv2fVNfvtTNJfmb5LsSTKXZEutdUuSU5PsHdzH+JJd3+TXL9n1TX59k1+/ZNc3+e3DpbNL
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
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[16]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">KBWY</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
KBWY Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2011-02-14 00:00:00
Account Value: 10000
	Buy Price: 21.23
	Num Shares: 471.0
	Remaining Value: 0.67
Sell Date: 
2011-08-12 00:00:00
	Sell Price: 18.24
	Updated Value: 8591.71

-------------------------

Buy Date: 
2012-01-25 00:00:00
Account Value: 8591.71
	Buy Price: 21.59
	Num Shares: 397.0
	Remaining Value: 20.48
Sell Date: 
2013-09-05 00:00:00
	Sell Price: 26.71
	Updated Value: 10624.35

-------------------------

Buy Date: 
2013-11-12 00:00:00
Account Value: 10624.35
	Buy Price: 28.06
	Num Shares: 378.0
	Remaining Value: 17.67
Sell Date: 
2013-11-14 00:00:00
	Sell Price: 28.51
	Updated Value: 10794.45

-------------------------

Buy Date: 
2014-02-28 00:00:00
Account Value: 10794.45
	Buy Price: 29.88
	Num Shares: 361.0
	Remaining Value: 7.77
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 35.65
	Updated Value: 12877.42


===============================

KBWY:
Final Value Basic: 17825.0
Final Value Crossover: 12877.42




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[17]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[17]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/283.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[18]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,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
KJpDmdbrrSeB7Pomv371nN2v/uqvZuPGjdm0aVP+8A//MO9+97sXiuZrXvOa3P/+98+xxx6bc845
Jy95yUsOevzLXvayXH311YteNnukv4l5qPv2ve0973lP7ne/++WRj3xkjj322PzZn/1ZkuRxj3tc
Lrroovz2b/92tmzZkoc//OF597vfvaTXva+e80N+PZNd36Y1vw1rvQEAOLLDF6/Vcv311x/x/mOO
OSaXXXbZfre9/vWv32/90Ic+NCeccEKe9rSnHfFr/ehHPzrk7Vu3bj3ovgNv27x5cy655JJDPv4Z
z3hGnvGMZxzxuQGglXLgr0Zv+sVLqaP8+gBMjlLKQX+uY1L88Ic/zAte8IKccsop+YM/+IO13s4R
TXIOALQ3+Llx0P8VduksAIzQV7/61WzevDm33nprzjvvvLXeDgCsCkVzCNN6vfUkkF3f5Nevaczu
UY96VO6+++5cccUVOfroo9d6O0OZxvwmifz6Jbu+TWt+iiYAAABNmdEEYCyYDRwPcgBgOcxoAgAA
sCoUzSFM6/XWk0B2fZNfv2TXN/n1TX79kl3fpjU/RRMAAICmzGgCMBYmdTZw3bp12bVrVx72sIdl
27ZtOeGEE/LHf/zHQ3/dN77xjfn3f//3XHTRRQ12eZ9JzQGA0TCjCUB3Sikjf1uKK664Ik960pMy
MzOTY445Jk95ylPyxS9+ccWv51AuueSSrF+/Phs3bsymTZtyyimn5BOf+MRhv9YFF1zQvGQCQCsb
1noDPduxY0fm5ubWehusgOz6Jr9+rSi77aPYydK/9re//e08+9nPzl//9V/n+c9/fn7wgx/ks5/9
bI466qgVPeWRzhY++clPzmc+85nUWvMXf/EXef7zn5+vf/3r2bRp036f96Mf/Sjr169f0fMPw7HX
N/n1S3Z9m9b8nNEEgCO47rrrUkrJWWedlVJKHvCAB+S0007LYx7zmIXPufjii/PoRz86W7Zsyemn
n56vfe1rK3que0toKSXnnHNOvve972XXrl3Zvn17nve85+Xss8/Opk2bcskll2T79u05++yzFx57
71nXzZs358QTT8yll16aJPnBD36Q1772tXnoQx+aBz/4wfnN3/zNfP/73x/iOwIAi1M0hzCN/2di
Usiub/LrV4/ZnXzyyVm/fn22bduWT37yk9mzZ89+93/kIx/JG9/4xnz4wx/O7bffnqc+9al54Qtf
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
J10ekqRmfkb1C1VTH3uy65v8+iW7vsmvb/Lrl+z6Jr/7OKO5BKWUX0nyl0l25b5feHR8kocneWWt
9bK12htHJru+ya9fsuub/Pomv37Jrm/y25+iuQSllGsz/6dcdh9w+0lJ/qHW+sg12RiLkl3f5Ncv
2fVNfn2TX79k1zf57W+Y3zo7TdZn/rT3gW6Oy4/Hnez6Jr9+ya5v8uub/Polu77Jbx9T94JX6OIk
/7OU8v7cdxr8hCQvGNzH+JJd3+TXL9n1TX59k1+/ZNc3+e3DpbNLVEp5dJLnJPmZwU03J/lorfWa
tdsVSyG7vsmvX7Lrm/z6Jr9+ya5v8ruPogkAAEBTZjSXoJQyU0p5Uynl2lLKnlLKHYOP31RKmVnr
/XF4suub/Polu77Jr2/y65fs+ia//SmaS/M3SfYkmUuypda6JcmpSfYO7mN8ya5v8uuX7Pomv77J
r1+y65v89uHS2SUopVxXa33Ecu9j7cmub/Lrl+z6Jr++ya9fsuub/PbnjObS3FBK+b1SyrH33lBK
eXAp5XVJvraG+2Jxsuub/Polu77Jr2/y65fs+ia/fSiaS3NWkgcl+efB9dZ7kuxIckyS56/lxliU
7Pomv37Jrm/y65v8+iW7vslvHy6dBQAAoClnNJeplPLYA9aPW6u9sDyy65v8+iW7vsmvb/Lrl+z6
Jj9FcyV+84D1K9ZkF6yE7Pomv37Jrm/y65v8+iW7vk19fi6dBQAAoKkNa72BXpRS1iX5xSQ/M7jp
5iRfqJr62JNd3+TXL9n1TX59k1+/ZNc3+d3HGc0lKKX8SpK/TLIryU2Dm49P8vAkr6y1XrZWe+PI
ZNc3+fVLdn2TX9/k1y/Z9U1++1M0l6CUcm2S02utuw+4/aQk/1BrfeSabIxFya5v8uuX7Pomv77J
r1+y65v89ueXAS3N+syf9j7QzXH58biTXd/k1y/Z9U1+fZNfv2TXN/ntY+pe8ApdnOR/llLen/tO
g5+Q5AWD+xhfsuub/Polu77Jr2/y65fs+ia/fbh0dolKKY9O8pzsP9j70VrrNWu3K5ZCdn2TX79k
1zf59U1+/ZJd3+R3H0UTAACApsxoLkEpZaaU8qZSyrWllD2llDsGH7+plDKz1vvj8GTXN/n1S3Z9
k1/f5Ncv2fVNfvtTNJfmb5LsSTKXZEutdUuSU5PsHdzH+JJd3+TXL9n1TX59k1+/ZNc3+e3DpbNL
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
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[19]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">PJP</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
PJP Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2005-09-19 00:00:00
Account Value: 10000
	Buy Price: 14.73
	Num Shares: 678.0
	Remaining Value: 13.06
Sell Date: 
2005-10-11 00:00:00
	Sell Price: 14.1
	Updated Value: 9572.86

-------------------------

Buy Date: 
2005-12-02 00:00:00
Account Value: 9572.86
	Buy Price: 14.7
	Num Shares: 651.0
	Remaining Value: 3.16
Sell Date: 
2006-05-26 00:00:00
	Sell Price: 14.6
	Updated Value: 9507.76

-------------------------

Buy Date: 
2006-08-21 00:00:00
Account Value: 9507.76
	Buy Price: 15.25
	Num Shares: 623.0
	Remaining Value: 7.01
Sell Date: 
2007-08-15 00:00:00
	Sell Price: 16.22
	Updated Value: 10112.07

-------------------------

Buy Date: 
2007-10-23 00:00:00
Account Value: 10112.07
	Buy Price: 17.24
	Num Shares: 586.0
	Remaining Value: 9.43
Sell Date: 
2007-11-07 00:00:00
	Sell Price: 16.73
	Updated Value: 9813.21

-------------------------

Buy Date: 
2008-08-07 00:00:00
Account Value: 9813.21
	Buy Price: 16.5
	Num Shares: 594.0
	Remaining Value: 12.21
Sell Date: 
2008-10-07 00:00:00
	Sell Price: 14.4
	Updated Value: 8565.81

-------------------------

Buy Date: 
2009-07-08 00:00:00
Account Value: 8565.81
	Buy Price: 13.98
	Num Shares: 612.0
	Remaining Value: 10.05
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 78.35
	Updated Value: 47960.25


===============================

PJP:
Final Value Basic: 58135.7
Final Value Crossover: 47960.25




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[20]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[20]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/284.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[21]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5oAAAMeCAYAAAB81HtFAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3X2wn3dd//n3J6ktN405SdW0C20Dqy04g6YCyo0MKUMX
cLCWEQsqpemwHe9/1JEd21HHLs6A4MCP1fU3SAVbYBFkVwTBH1A7ZKGj6OKSclOgWyVQoE1b2pRy
I0Phs3/kJE3T3LySXN/kOtf1eMxkmuubc77nyjMnad/9ft4nrfdeAAAAMJRVx/sGAAAAmBaDJgAA
AIMyaAIAADAogyYAAACDMmgCAAAwKIMmAAAAgzrkoNlau6K19unW2idba29rrZ3UWlvfWru2tXZT
a+2DrbWlY3GzAAAAjN9BB83W2saqurSqfqL3/riqWl1VL6yqy6vq2t77WVV13fI1AAAAHPIVza9V
1Xeq6mGttROq6mFV9ZWqOr+qrll+m2uq6oKF3SEAAAArykEHzd77XVX1mqr6Yu0aMHf23q+tqg29
9x3Lb7ajqjYs9C4BAABYMQ51dPZ/rKrLqmpjVf0PVXVya+1Fe79N771XVV/UDQIAALCynHCIH39C
Vf1T7/2rVVWttb+tqidX1W2ttVN777e11k6rqtv3986tNQMoAADAhPXe276PHWpH87NV9aTW2kNb
a62qnllVN1bV31fVxctvc3FV/d1BPuiovl188cXH/R5WwjedtNJJq7F/00knrXQa+zetdJpDpwM5
6CuavfcbWmtvrqqPVdX3qur/rao3VNWaqvqb1tpLqmp7VV14iIF1NDZu3Hi8b2FF0CmnVUannFYZ
nTI65bTK6JTTKqNTZqV1OtTR2eq9v7qqXr3Pw3fVrlc3AQAA4AEOdXR2cpaWlo73LawIOuW0yuiU
0yqjU0annFYZnXJaZXTKrLROsxs0N23adLxvYUXQKadVRqecVhmdMjrltMrolNMqo1NmpXVqB1vg
POonb63v7/l3fV0hxmCRv/4AAMC0tdaq7+erzh5yR3NRDDjHn4EfAABYhNkdnSWzdevW430LK4ZW
GZ1yWmV0yuiU0yqjU06rjE6ZldbJoAkAAMCgjtuOpqOzx59fBwAA4GgcaEfTK5orxBe/+MVas2aN
wRAAABi90QyarbWFf0ts3LixHvawh9WaNWtq/fr19dznPre+9KUvLeTnvGrVqjr55JNrzZo19chH
PrJ+53d+p773ve/t923POOOMuvfee4/ZF/BZaWfAjyetMjrltMrolNEpp1VGp5xWGZ0yK63TaAbN
XfoCv2Vaa/Xe97637r333rr11ltrw4YN9Vu/9VuD/Oz25xOf+ETde++9dd1119Xb3va2uuqqqx70
Nvfdd9/CPj4AAMDQRjZojstJJ51UP//zP1833njjnsc2b95cb3zjG/dcX3311fW0pz2tqqp+4zd+
o172spc94DnOP//8et3rXnfIj3X22WfX0572tPr0pz9dX/jCF2rVqlX1pje9qc4888x65jOfueex
3a943nXXXXXJJZfUIx7xiFq/fn0973nP2/Nc733ve2vTpk21bt26eupTn1qf/OQnD/vnvnnz5sN+
n7nSKqNTTquMThmdclpldMppldEpc+655x7z055H47j9PZpjtnsP8pvf/Ga94x3vqCc/+cl7fuxg
vzBbtmypCy64oP7kT/6kWmt155131nXXXfeAwfRAH+vGG2+sj3zkI/WKV7xiz499+MMfrs9+9rO1
atWquvXWWx/wfhdddFF9//d/f91444318Ic/vP75n/+5qqo+/vGP10te8pJ673vfW094whPqLW95
S51//vn1uc99rk488cQjCwIAABx/V47seQ7CK5r76L3XBRdcUOvWraulpaW67rrrHvQq5YE88YlP
rLVr19Z1111XVVVvf/vb69xzz60f/MEfPOD7/MRP/EStX7++zj///Lr00kvrkksu2TN8XnnllfXQ
hz60TjrppAe8z6233lrvf//76/Wvf32tXbu2TjjhhD2vqr7hDW+oX/mVX6knPvGJ1VqrF7/4xXXS
SSfVRz/60cPqsNLOgB9PWmV0ymmV0SmjU06rjE45rTI6TZNBcx+ttXr3u99dd999d33729+uP/uz
P6unP/3pdfvtt0fv/+IXv7je+ta3VlXVW9/61rrooosO+vYf//jH66677qqbb765Xv7ylz/gx04/
/fT9vs8tt9xS69evr7Vr1z7ox77whS/Ua17zmlq3bt2eb1/60pce9IooAADAohg0D6K1Vs973vNq
9erVdf3111dV1cMf/vD6xje+sedtbrvttge8z4te9KJ697vfXTfccEN99rOfrQsuuOCoPv7+nH76
6XXXXXfVPffc86AfO+OMM+r3fu/36u67797z7etf/3q94AUvOKyP7ax8TquMTjmtMjpldMppldEp
p1VGp2kyaO7H7qOrvfc9r24+9rGPraqqTZs21d/+7d/Wt771rbr55pvrjW984wMGwkc+8pH1hCc8
oV784hfX85///Acdex3CaaedVs95znPq13/912vnzp31ne98pz784Q9XVdWll15ar3/96+tf//Vf
q/de3/jGN+p973tfff3rXx/8PgAAAPbHoLkfP/uzP1tr1qyptWvX1h/8wR/Um9/85j2D5m//9m/X
iSeeWBs2bKhLLrmkXvSiFz3o/S+++OL65Cc/echjswf7ak/7+7G9H3vLW95S3/d931ePecxjasOG
DfWnf/qnVVX1+Mc/vq666qr6zd/8zVq/fn39yI/8SL35zW+Oft57c1Y+p1VGp5xWGZ0yOuW0yuiU
0yqj0zSN7KvOLv7L7B7K5z//+YP++CmnnFIf+MAHHvDYH/7hHz7g+swzz6zTTz+9nv70px/0ub77
3e/u9/GNGzc+6Mf2fWzdunV19dVX7/f9n/WsZ9WznvWsg35sAACARWm7j4ku5Mlb6/t7/tZaLfLj
Hk/f+c536oUvfGGdc8459fu///vH+3YOasq/DgAAMCWttUH/epOh5oDlmeJBrxg6Ojugz3zmM7Vu
3brasWNHXXbZZcf7dgAAAI4Lg+aAHvvYx9bXv/71uv766+vkk08+3rdzVJyVz2mV0SmnVUanjE45
rTI65bTK6DRNBk0AAAAGZUdzxvw6AADAymBHEwAAgFkzaLJfzsrntMrolNMqo1NGp5xWGZ1yWmV0
miaDJgAAAIOyozmgVatW1c0331yPfvSja8uWLXX66afXH/3RHx31877yla+s//iP/6irrrpqgLu8
31R/HQAAYGrsaB6h1trCvyWuv/76espTnlJLS0t1yimn1E//9E/Xxz72sSP++ezP1VdfXatXr641
a9bU2rVr65xzzqn3ve99B3yuK664YvAhEwAAYFFOON438ABXHt/n/trXvlbPfe5z6y/+4i/qwgsv
rG9/+9v1kY98pE466aQj+pAH+78ET33qU+vDH/5w9d7rz//8z+vCCy+sr3zlK7V27doHvN13v/vd
Wr169RF9/KOxdevW2rx58zH/uCuRVhmdclpldMrolNMqo1NOq4xO0zSaVzTH4KabbqrWWr3gBS+o
1lo95CEPqfPOO68e97jH7XmbN73pTfWjP/qjtX79+nr2s59dX/ziF4/oY+0eQltrdckll9S3vvWt
uvnmm+vKK6+s5z//+XXRRRfV2rVr6+qrr64rr7yyLrrooj3vu/tV13Xr1tUZZ5xR11xzTVVVffvb
366XvexldeaZZ9app55av/Zrv1b/+Z//eRRFAAAADp9Bcy9nn312rV69urZs2VLvf//76+67737A
j7/73e+uV77ylfWud72r7rzzznra055Wv/iLv3hUH/O+++6rv/zLv6w1a9bUWWedVVVV73nPe+oX
fuEX6p577qlf/uVffsAR3C984Qv1Mz/zM/XSl7607rzzztq2bVtt2rSpqqouv/zyuvnmm+uGG26o
m2++ub785S/Xy1/+8iO6L/9XKadVRqecVhmdMjrltMrolNMqo9M0GTT3smbNmrr++uurtVaXXnpp
/dAP/VD93M/9XN1+++1VVfX617++rrjiijr77LNr1apVdcUVV9S2bdvqlltuOeyP9dGPfrTWrVtX
p512Wr3jHe+od73rXbVmzZqqqnrKU55S559/flVVPeQhD3nAEdy3ve1tdd5559ULXvCCWr16da1f
v75+/Md/vHrvddVVV9VrX/vaWlpaqpNPPrmuuOKKevvb3z5AGQAAgJxBcx+Pecxj6q/+6q/qlltu
qU996lP1la98pS677LKq2vVq4ktf+tJat25drVu3rk455ZSqqvryl7982B/nSU96Ut199911xx13
1D/90z/VM57xjD0/9shHPvKA73fLLbfUox/96Ac9fscdd9Q3v/nNevzjH7/n/p7znOfUnXfeedj3
VuXvMzocWmV0ymmV0SmjU06rjE45rTI6TZNB8yDOPvvsuvjii+tTn/pUVVWdccYZ9YY3vKHuvvvu
Pd++8Y1v1JOe9KTBPuahvkLuGWecUf/+7//+oMd/4Ad+oB760IfWjTfeuOfedu7cWV/72tcGuzcA
AICEQXMvn/vc5+q1r33tnlcob7nllvrrv/7revKTn1xVVb/6q79ar3jFK+rGG2+sqqp77rmn3vnO
d+73uY7076U51Pv90i/9Uv3jP/5jvfOd76z77ruvvvrVr9YNN9xQq1atqksvvbQuu+yyuuOOO6pq
1yutH/zgB4/oPpyVz2mV0SmnVUanjE45rTI65bTK6DRNBs29rFmzpv7lX/6lfuqnfqpOPvnkevKT
n1w/9mM/Vq95zWuqquqCCy6o3/3d360XvvCFtXbt2nrc4x5XH/jAB/a8/96vRB7slcnD/bG9Hzvj
jDPqH/7hH+o1r3lNnXLKKXXOOefUJz7xiaqqetWrXlU//MM/XE960pNq7dq1dd5559VNN9105EEA
AACOQDvSV96iJ2+t7+/5W2sPeuXuYMdFh7LIn+tKtL9fh938fUY5rTI65bTK6JTRKadVRqecVhmd
Mq21qisHerIrh5uNlmeKBw1zJwzy7AMwBAIAAEzDaF7R5Njz6wAAACvDSntF044mAAAAgzJosl/+
PqOcVhmdclpldMrolNMqo1NOq4xO02TQBAAAYFB2NGfMrwMAAKwMK21H87h91dlj8deZAAAAcOwd
l6Ozvffj9u1DH/rQcf34Y/t2IM7K57TK6JTTKqNTRqecVhmdclpldJomO5oAAAAM6rjsaAIAAJBb
aTuaXtEEAABgULMbNJ0Bz+iU0yqjU06rjE4ZnXJaZXTKaZXRaZpmN2gCAACwWHY0AQAARs6OJgAA
ALM2u0HTGfCMTjmtMjrltMrolNEpp1VGp5xWGZ2maXaDJgAAAItlRxMAAGDk7GgCAAAwa7MbNJ0B
z+iU0yqjU06rjE4ZnXJaZXTKaZXRaZpmN2gCAACwWHY0AQAARs6OJgAAALM2u0HTGfCMTjmtMjrl
tMrolNEpp1VGp5xWGZ2maXaDJgAAAItlRxMAAGDk7GgCAAAwa7MbNJ0Bz+iU0yqjU06rjE4ZnXJa
ZXTKaZXRaZpmN2gCAACwWHY0AQAARs6OJgAAALM2u0HTGfCMTjmtMjrltMrolNEpp1VGp5xWGZ2m
aXaDJgAAAItlRxMAAGDk7GgCAAAwa7MbNJ0Bz+iU0yqjU06rjE4ZnXJaZXTKaZXRaZpmN2gCAACw
WHY0AQAARm5yO5qttbNbax/f69s9rbX/0lpb31q7trV2U2vtg621pUHuFAAAgBXtkINm7/1zvfdz
eu/nVNXjq+qbVfWuqrq8qq7tvZ9VVdctX4+eM+AZnXJaZXTKaZXRKaNTTquMTjmtMjpN0+HuaD6z
qm7uvd9SVedX1TXLj19TVRcMeWMAAACsTIe1o9lae1NVfaz3/t9aa3f33tctP96q6q7d13u9vR1N
AACAozS5Hc29nuDEqvrZqnrnvj+2PE2aKAEAAKgTDuNtn1NV/9Z7v2P5ekdr7dTe+22ttdOq6vb9
vdOWLVtq48aNVVW1tLRUmzZtqs2bN1fV/eexj+X1tm3b6rLLLjtuH3+lXO99Vn4M9zPm692PjeV+
xnr9ute97rj//l8p137/+fPc59Pxud792FjuZ6zX/jzPr/3+8+f50Nf1+V3/qEfV0V0vO9Jfr507
d1ZV1fbt2+tA4qOzrbW3V9V/771fs3z96qr6au/9Va21y6tqqfd++T7vM7qjs1u3br3/F4oD0imn
VUannFYZnTI65bTK6JTTKqNTZqUdnY0Gzdbaw6vqC1X1qN77vcuPra+qv6mqM6pqe1Vd2Hvfuc/7
jW7QBAAAWGlW2qAZHZ3tvX+jqn5gn8fuql1fhRYAAAD2WHW8b+BY2/usPAemU06rjE45rTI6ZXTK
aZXRKadVRqdpmt2gCQAAwGId1t+jedhPbkcTAADgqK20HU2vaAIAADCo2Q2azoBndMppldEpp1VG
p4xOOa0yOuW0yug0TbMbNAEAAFgsO5oAAAAjZ0cTAACAWZvdoOkMeEannFYZnXJaZXTK6JTTKqNT
TquMTtM0u0ETAACAxbKjCQAAMHJ2NAEAAJi12Q2azoBndMppldEpp1VGp4xOOa0yOuW0yug0TbMb
NAEAAFgsO5oAAAAjZ0cTAACAWZvdoOkMeEannFYZnXJaZXTK6JTTKqNTTquMTtM0u0ETAACAxbKj
CQAAMHJ2NAEAAJi12Q2azoBndMppldEpp1VGp4xOOa0yOuW0yug0TbMbNAEAAFgsO5oAAAAjZ0cT
AACAWZvdoOkMeEannFYZnXJaZXTK6JTTKqNTTquMTtM0u0ETAACAxbKjCQAAMHJ2NAEAAJi12Q2a
zoBndMppldEpp1VGp4xOOa0yOuW0yug0TbMbNAEAAFgsO5oAAAAjZ0cTAACAWZvdoOkMeEannFYZ
nXJaZXTK6JTTKqNTTquMTtM0u0ETAACAxbKjCQAAMHJ2NAEAAJi12Q2azoBndMppldEpp1VGp4xO
Oa0yOuW0yug0TbMbNAEAAFgsO5oAAAAjZ0cTAACAWZvdoOkMeEannFYZnXJaZXTK6JTTKqNTTquM
TtM0u0ETAACAxbKjCQAAMHJ2NAEAAJi12Q2azoBndMppldEpp1VGp4xOOa0yOuW0yug0TbMbNAEA
AFgsO5oAAAAjZ0cTAACAWZvdoOkMeEannFYZnXJaZXTK6JTTKqNTTquMTtM0u0ETAACAxbKjCQAA
MHJ2NAEAAJi12Q2azoBndMppldEpp1VGp4xOOa0yOuW0yug0TbMbNAEAAFgsO5oAAAAjZ0cTAACA
WZvdoOkMeEannFYZnXJaZXTK6JTTKqNTTquMTtM0u0ETAACAxbKjCQAAMHJ2NAEAAJi12Q2azoBn
dMppldEpp1VGp4xOOa0yOuW0yug0TbMbNAEAAFgsO5oAAAAjZ0cTAACAWZvdoOkMeEannFYZnXJa
ZXTK6JTTKqNTTquMTtM0u0ETAACAxbKjCQAAMHJ2NAEAAJi12Q2azoBndMppldEpp1VGp4xOOa0y
OuW0yug0TbMbNAEAAFgsO5oAAAAjZ0cTAACAWZvdoOkMeEannFYZnXJaZXTK6JTTKqNTTquMTtM0
u0ETAACAxbKjCQAAMHKT3NFsrS211v7P1tpnWms3ttZ+qrW2vrV2bWvtptbaB1trS4PcKQAAACta
enT2f6uqf+i9P7aqfqyqPltVl1fVtb33s6rquuXr0XMGPKNTTquMTjmtMjpldMppldEpp1VGp2k6
5KDZWltbVU/rvb+pqqr3fl/v/Z6qOr+qrll+s2uq6oKF3SUAAAArxiF3NFtrm6rqL6rqxqr68ar6
t6q6rKq+1Htft/w2raru2n291/va0QQAADhKK21H84TgfU+oqp+oqt/svf8/rbXX1T7HZHvvvbW2
3zvdsmVLbdy4saqqlpaWatOmTbV58+aquv9lcteuXbt27dq1a9euXbt2ffDr+vyuf9Sj6uiulx3J
/Wzbtq127txZVVXbt2+vA0le0Ty1qv659/6o5eufrqorqurRVXVu7/221tppVfWh3vtj9nnf0b2i
uXXr1vt/oTggnXJaZXTKaZXRKaNTTquMTjmtMjplVtormqsO9Y6999uq6pbW2lnLDz2zqj5dVX9f
VRcvP3ZxVf3dIHcKAADAihb9PZqttR+vqr+sqhOr6t+r6pKqWl1Vf1NVZ1TV9qq6sPe+c5/3G90r
mgAAACvNSntFM9nRrN77DVX1xP380DOP9sYAAACYlkMenZ2a3QutHJxOOa0yOuW0yuiU0SmnVUan
nFYZnaZpdoMmAAAAixXtaB7xk9vRBAAAOGorbUfTK5oAAAAManaDpjPgGZ1yWmV0ymmV0SmjU06r
jE45rTI6TdPsBk0AAAAWy44mAADAyNnRBAAAYNZmN2g6A57RKadVRqecVhmdMjrltMrolNMqo9M0
zW7QBAAAYLHsaAIAAIycHU0AAABmbXaDpjPgGZ1yWmV0ymmV0SmjU06rjE45rTI6TdPsBk0AAAAW
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
x/L3d1TVhoHuBwAAgBXuqL8YUO+9V1Uf4F4AAACYgBOO8P12tNZO7b3f1lo7rapuP9AbbtmypTZu
3FhVVUtLS7Vp06bavHlzVVVt3bq1quqQ1/fbfb35KK/rsD7+XK/r87v+UY+qo7tedrx/Pg/6+fl8
OqbXVbXrc+JoP5+Wr4/3z2e/P7/aWkf/+TSOn89Kud7jaP+8Wn7O4/3zOeDPz+fTMbnew+fTIa7H
+fMb6/VU/3tqrzta/ufmo7yuY3r/K/V6DJ9P27Ztq507d1ZV1fbt2+tA2q4XJA+utbaxqv6+9/64
5etXV9VXe++vaq1dXlVLvfcHfUGg1lpPnj/4+DXci6athrinqWutVV050JNdWaNr7nPq2PM5dVjP
Nrqf3xj5nIqfaXQ/t7Ea7HPqyvF9PlX5nDoepvw55d97x95Y/73XWqvee9v38VXBO/51Vf1TVZ3d
WrultXZJVf1xVZ3XWrupqp6xfA0AAACHPjrbe//FA/zQMwe+FwAAACbgkK9oAgAAwOEwaAIAADAo
gyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgCAAAwKIMmAAAA
gzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiDJgAAAIMyaAIA
ADAogyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgCAAAwKIMm
AAAAgzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiDJgAAAIMy
aAIAADAogyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgCAAAw
KIMmAAAAgzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiDJgAA
AIMyaAIAADAogyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgC
AAAwKIMmAAAAgzJoAgAAMCiDJgAAAIMyaAIAADAogyYAAACDMmgCAAAwKIMmAAAAgzJoAgAAMCiD
JgAAAIMyaAIAADAogyYAAACDOqpBs7X27NbaZ1tr/19r7XeHuikAAABWriMeNFtrq6vqf6+qZ1fV
j1bVL7bWHjvUjQEAALAyHc0rmj9ZVTf33rf33r9TVW+vqp8b5rYAAABYqY5m0HxEVd2y1/WXlh8D
AABgxlrv/cjesbWfr6pn994vXb5+UVX9VO/9t/Z6myN7cgAAAFaE3nvb97ETjuL5vlxVp+91fXrt
elXzoB8QAACAaTuao7Mfq6ofaa1tbK2dWFUvqKr3DHNbAAAArFRH/Ipm7/2+1tpvVtUHqmp1Vb2x
9/6Zwe4MAACAFemIdzQBAABgf45mR3P0Wmuratdfw/KIquq1a6/0X7vp+gF0ymmV0SmnVUanjE45
rTI65bTK6JSZQqfJvqLZWvufquq/VdXNdf8XKXpkVf1IVf167/0Dx+vexkSnnFYZnXJaZXTK6JTT
KqNTTquMTpmpdJryoPnZ2vXXr2zf5/FHVdV/770/5rjc2MjolNMqo1NOq4xOGZ1yWmV0ymmV0Skz
lU5H81Vnx2517XqJeV9frokfGT5MOuW0yuiU0yqjU0annFb/f3v3H2x5Xd93/PlaFoVEknXBirAr
oIKIGRQY0RqrbIgMSRuwkQC10GxMxqqTarREW5JpHTvV1VqUJqFtppKGOqxBTBBbkRLNktqELARc
jHT5Yfi5gRHlUgWCXeHdP873eu9ed+F1l937+Z7PfT1mdjj3+52defPkfL+cz/1+zzmedPKllSed
PF10mppBd8PFwPWSNjJ3yXktcPawLybSyZdWnnTypZUnnTzp5EsrTzr50sqTTp4uOnV76yyApGOA
04FDhk3bgCur6pZ2U41POvnSypNOvrTypJMnnXxp5UknX1p50snTQ6euF5oRERERERGx9Lp9j6ak
VZI2SNoqaUbSQ8PjDZJWtZ5vLNLJl1aedPKllSedPOnkSytPOvnSypNOnl46dbvQBC4DZoCTgNVV
tRpYBzw87IuJdPKllSedfGnlSSdPOvnSypNOvrTypJOni07d3jor6baqOmqx+5abdPKllSedfGnl
SSdPOvnSypNOvrTypJOnl049X9G8W9L7JD1/doOkgyW9H7in4Vxjk06+tPKkky+tPOnkSSdfWnnS
yZdWnnTydNGp54XmWcBBwLXDvc0zwCbgQODMloONTDr50sqTTr608qSTJ518aeVJJ19aedLJ00Wn
bm+djYiIiIiIiDZ6vqL5A5KOX/DzCa1mGbN08qWVJ518aeVJJ086+dLKk06+tPKkk2eaOy2LhSbw
jgU/v73JFOOXTr608qSTL6086eRJJ19aedLJl1aedPJMbafcOhsRERERERF71MrWA+xNklYAJwKH
DJu2AZsrq+sdpJMvrTzp5EsrTzp50smXVp508qWVJ508PXTq9oqmpFOAi4A7gPuGzWuAI4F3VtXV
rWYbk3TypZUnnXxp5UknTzr50sqTTr608qSTp5dOPS80twKnVtVdC7YfAVxVVUc3GWxk0smXVp50
8qWVJ5086eRLK086+dLKk06eXjr1/GFA+zC5xLzQNjq/ZXiR0smXVp508qWVJ5086eRLK086+dLK
k06eLjpNzaC74WLgekkbmbvkvBY4e9gXE+nkSytPOvnSypNOnnTypZUnnXxp5UknTxedur11FkDS
McDp7Pgm2iur6pZ2U41POvnSypNOvrTypJMnnXxp5UknX1p50snTQ6euF5oRERERERGx9Lp9j6ak
VZI2SNoqaUbSQ8PjDZJWtZ5vLNLJl1aedPKllSedPOnkSytPOvnSypNOnl46dbvQBC4DZoCTgNVV
tRpYBzw87IuJdPKllSedfGnlSSdPOvnSypNOvrTypJOni07d3jor6baqOmqx+5abdPKllSedfGnl
SSdPOvnSypNOvrTypJOnl049X9G8W9L7JD1/doOkgyW9H7in4Vxjk06+tPKkky+tPOnkSSdfWnnS
yZdWnnTydNGp54XmWcBBwLXDvc0zwCbgQODMloONTDr50sqTTr608qSTJ518aeVJJ19aedLJ00Wn
bm+djYiIiIiIiDZ6vqL5A5KOX/DzCa1mGbN08qWVJ518aeVJJ086+dLKk06+tPKkk2eaOy2LhSbw
jgU/v73JFOOXTr608qSTL6086eRJJ19aedLJl1aedPJMbafcOhsRERERERF71MrWA+xNklYAJwKH
DJu2AZsrq+sdpJMvrTzp5EsrTzp50smXVp508qWVJ508PXTq9oqmpFOAi4A7gPuGzWuAI4F3VtXV
rWYbk3TypZUnnXxp5UknTzr50sqTTr608qSTp5dOPS80twKnVtVdC7YfAVxVVUc3GWxk0smXVp50
8qWVJ5086eRLK086+dLKk06eXjr1/GFA+zC5xLzQNjq/ZXiR0smXVp508qWVJ5086eRLK086+dLK
k06eLjpNzaC74WLgekkbmbvkvBY4e9gXE+nkSytPOvnSypNOnnTypZUnnXxp5UknTxedur11FkDS
McDp7Pgm2iur6pZ2U41POvnSypNOvrTypJMnnXxp5UknX1p50snTQ6euF5oRERERERGx9Lp9j6ak
VZI2SNoqaUbSQ8PjDZJWtZ5vLNLJl1aedPKllSedPOnkSytPOvnSypNOnl46dbvQBC4DZoCTgNVV
tRpYBzw87IuJdPKllSedfGnlSSdPOvnSypNOvrTypJOni07d3jor6baqOmqx+5abdPKllSedfGnl
SSdPOvnSypNOvrTypJOnl049X9G8W9L7JD1/doOkgyW9H7in4Vxjk06+tPKkky+tPOnkSSdfWnnS
yZdWnnTydNGp54XmWcBBwLXDvc0zwCbgQODMloONTDr50sqTTr608qSTJ518aeVJJ19aedLJ00Wn
bm+djYiIiIiIiDZ6vqIZERERERERDWShGREREREREXtUFpoRERERERGxR3W90JR0gKRfkPQeSe+W
dKqkrv+d9yRJb2w9w9hI+jFJL97J9mNbzDNGkg6TtP/weIWkt0r6bUnvkLSy9XzTIsffrkl6kaQ3
Szq69SxjI2mNpNXD45dIOkPSVHwM/lKSdJqk/VrPMXbp5Esrn6Q3SHrp8Ph1kn5d0t9vPdfY9NCp
2w8DknQmcB5wM5MvOP1zQMCxwD+uqpsbjjcVJN1bVWtbzzEWw3PqE8A3gX2BX6qqzcO+m6rquJbz
jYWkrwOvqqrHJH0UeBFwBXAyUFX11qYDTokcf3MkXVFVbxoen87kONwE/CTw4ar6vYbjjYakdwPv
AbYDHwd+DfhfTDp9qKouaTjeqEj6W+Ax4AvARuDqqnqi7VTjk06+tPJIuhB4FZPXUV9k8trgKuAN
wFer6ryG441GL516Xmh+DXj18GL3IODSqjpluPL0n6rqtY1HHAVJn3+K3SdX1Y8s2TAjJ2kLcGpV
3S/pROAS4Pyq+sMsNOdIuqWqjhke38hk0fnE8PPNVZWrv4Mcf575x5ekPwfeUlV3Duf2L+c5NTH8
kudEYH8m37P24uF89VwmnXKOGki6Cfgp4BeAs4GfAP4Q2FhV17acbUzSyZdWHkm3MGmzP7ANOLSq
HpW0L5MF1MubDjgSvXTq/Ta2x4d/Pgo8D6Cqbpb04+1GGp3XAecCj8zbVkyu/r66yUTjtU9V3Q9Q
VZslrQP+u6RcddrRfZJOrqovAXcCa4G7hkVBn7/Z2n05/hbvWVV1J0BVfUvSk60HGpH/V1WPAo9K
umPe+WpGkhrPNjpVNQP8LvC7kl7A5LvpPiLp0NxNMCedfGllqeHPE/MeAzxJXiPM10WnnheaXwC+
KCnyxYUAAA9ASURBVOlPgVOBzwBIOrDpVOPzF8BjVbVp4Q5Jty79OKP2HUkvrqpvAAxXCtYBfwRM
xW+WlsivAJdI+gDwMPBVSV8FVgH/vOVgI5Tjz3OspO8Oj/eT9ILh+Hs2nX/WwCI9KWnfqtoO/Ozs
xuE901loPoVhUX4hcKGkw9tOM17p5EurXfoSk1v6nwX8DnCNpNlbQq9pOdjIdNGp21tnAYY3zL4M
2FJV1wzbVjD5jfjjT/mXIxaQ9Erg0aq6fcH2ZwFnVtWn2kw2TpKOAY5i8gute4Eb8n6V2JMkrQKO
qao/az3LGEg6DPibYaE5f/uhTDpNzYuTvU3Suqr6k9ZzjF06+dLKM9xd8Qbgm1V1i6TXA38X+D9V
dWXb6cajl05dLzQj9pbZT3WsqodazxIREbsv53NPOvnSypNOnmnutCxvORo+KCieRjrtaPjajk9L
ehDYDGyW9OCw7fC2042HpBcOTb4i6fzhjeuz+65oOdvYpNUzl/PUnDyffDmfe9LJl1aedPL00qnb
92hKevNONs9+yMYLlnic0UqnRfkDJl8ZcE5VfR9Ak++FPAP4NPCahrONycXA5Uzef/jLwLWSTquq
bwGHNZ1sfNLKkPOULc8nX87nnnTypZUnnTxddOr21llJ24FLmXw60w67gDOq6jlLP9X4pJNP0u1V
deRi9y03krZU1Svm/XwOcD7wc8Dl+YqFOWnlyXnKk+eTL+dzTzr50sqTTp5eOnV7RRP4GvCxqvqh
26okndxgnrFKJ9+Nki4Cfp/Jh9sAvBD4ReCmZlONz0pJ+81+4FZVfUrSA8DVwI+2HW100sqT85Qn
zydfzueedPKllSedPF106vmK5uuBu6vq7p3se1VVXd9grNFJJ58mX6Xwy8BpwKHD5m3AlcAnq+p7
rWYbE0nvBW5c+JUdko4DPlpVb2wy2AillSfnKU+eT76czz3p5EsrTzp5eunU7UIzIiIiIiIi2lhW
nzor6cbWM0yDdPKllSedfGnlSSdPOvnSypNOvrTypJNnGjstq4Umkw+OiKeXTr608qSTL6086eRJ
J19aedLJl1aedPJMXaflttD8QusBpkQ6+f5H6wGmRJ5TvrTypJMnnXw5n3vynPKllSfHnmfqOi2L
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
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[22]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">SCHG</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
SCHG Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2010-03-17 00:00:00
Account Value: 10000
	Buy Price: 25.75
	Num Shares: 388.0
	Remaining Value: 9.0
Sell Date: 
2010-06-02 00:00:00
	Sell Price: 24.17
	Updated Value: 9386.96

-------------------------

Buy Date: 
2010-10-01 00:00:00
Account Value: 9386.96
	Buy Price: 25.59
	Num Shares: 366.0
	Remaining Value: 21.02
Sell Date: 
2011-08-17 00:00:00
	Sell Price: 27.49
	Updated Value: 10082.36

-------------------------

Buy Date: 
2012-01-24 00:00:00
Account Value: 10082.36
	Buy Price: 30.26
	Num Shares: 333.0
	Remaining Value: 5.78
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 54.29
	Updated Value: 18084.35


===============================

SCHG:
Final Value Basic: 21716.0
Final Value Crossover: 18084.35




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[23]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[23]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/285.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[24]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5oAAAMeCAYAAAB81HtFAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3X+Q3XV9P/rnO0lFK7nZBNtAhRCcCugdbdDaotZxdaT+
GIs4taBVJIzD+Ku92tZbYdpOc+1M1e+Mfnvb246ViqB+xR/fW4tXW5FmTJXpWOtcgz8i5aY1CAgB
TIKAPyr2ff/IJiz5Qc5uXnvOZzePx0yG/ZyzZ/eTk+esffZznmdb7z0AAABQZdmkTwAAAIClRdEE
AACglKIJAABAKUUTAACAUoomAAAApRRNAAAASo1UNFtrU621/9la+2ZrbVtr7Zdba2taa9e11m5q
rX22tTa10CcLAADA8I16RfP/TPL3vfcnJHlykhuTXJrkut776Uk2zxwDAABwjGu994f/hNZWJflK
7/1xB9x+Y5Jn9953ttZOTLKl937mwp0qAAAAi8EoVzRPS3JXa+39rbX/t7V2eWvt0UnW9t53znzO
ziRrF+wsAQAAWDRGKZorkjwlyV/13p+S5P4c8DLZvvey6MNfGgUAAOCYsGKEz7k1ya2993+dOf6f
SS5Lckdr7cTe+x2ttZOS3HngA1tryicAAMAS1ntvB952xKI5UyRvaa2d3nu/Kcnzknxj5s9FSd45
89+/O8zjj+qkjwUbN27MlVdeOenTYAmRKarJFNVkikryRDWZGl1rB3XMJKNd0UyS307yP1prj0jy
70kuTrI8ycdaa69JsiPJ+Ud/msem9evXT/oUWGJkimoyRTWZopI8UU2mjt5IRbP3fkOSpx3irufV
ng4AAACL3ai/R5MFNDU1NelTYImRKarJFNVkikryRDWZOnqK5gBs2LBh0qfAEiNTVJMpqskUleSJ
ajJ19NpCvllPa617MyAAAGA+DvdGM0zGobpda21+7zoLAAAwKS5cDcNcS7+Xzg7Ali1bJn0KLDEy
RTWZoppMUUmeYHgUTQAAAErZaAIAAIM0s/+b9GmQw/9bHG6j6YomAADAEvHtb387K1eunHhBVzQH
wK6AajJFNZmimkxRSZ6OLa21Bf8zivXr1+enf/qns3LlyqxZsyYvfvGLc+utty7I33nZsmU5/vjj
s3Llypx88sn5vd/7vfzXf/3XIT933bp1uffeeyf+jr2KJgAAsMj0BfwzmtZaPvWpT+Xee+/N7bff
nrVr1+a3f/u3S/52h/LVr3419957bzZv3pwPf/jDufzyyw/6nAceeGDBvv9cKZoDMD09PelTYImR
KarJFNVkikryxKQdd9xx+fVf//Vs27Zt/23T09N53/vet//4yiuvzLOe9awkyRvf+Ma85S1vecjX
OPfcc/Nnf/ZnR/xeZ5xxRp71rGflG9/4Rm6++eYsW7YsV1xxRU499dQ873nP23/bviueu3btysUX
X5zHPvaxWbNmTV760pfu/1qf+tSnsmHDhqxevTrPfOYz87Wvfe2onofZFE0AAIB52LeD/P73v5+P
fvSjefrTn77/vod7Ge7GjRtz9dVX73/83Xffnc2bN+eVr3zlEb/Xtm3b8oUvfCFnnXXW/vs+//nP
58Ybb8y111570DbzwgsvzA9/+MNs27Ytd955Z373d383SfKVr3wlr3nNa3L55Zdn165dee1rX5tz
zz03//mf/zmPZ+JgiuYA2BVQTaaoJlNUkykqyROT0HvPeeedl9WrV2dqaiqbN28+6Crl4TztaU/L
qlWrsnnz5iTJRz7ykTznOc/Jz/zMzxz2MU95ylOyZs2anHvuubnkkkty8cUX7y+VmzZtyqMe9agc
d9xxD3nM7bffns985jN5z3vek1WrVmXFihX7r6q+973vzWtf+9o87WlPS2str371q3Pcccfli1/8
4nyejoMomgAAAHPUWss111yT3bt350c/+lH+4i/+Is9+9rNz5513jvT4V7/61fnQhz6UJPnQhz6U
Cy+88GE//ytf+Up27dqV7du3521ve9tD7jvllFMO+Zhbbrkla9asyapVqw667+abb8673vWurF69
ev+fW2+9NbfffvtI538kiuYA2BVQTaaoJlNUkykqyROT1lrLS1/60ixfvjzXX399kuTRj3507r//
/v2fc8cddzzkMa961atyzTXX5IYbbsiNN96Y884776i+/6Gccsop2bVrV+65556D7lu3bl3+4A/+
ILt3797/57777ssFF1ww7/OYTdEEAACYh30vXe2977+6+YQnPCFJsmHDhvzt3/5tfvCDH2T79u15
3/ve95BCePLJJ+cXf/EX8+pXvzove9nLDnrZa4WTTjopL3zhC/OGN7whe/bsyY9//ON8/vOfT5Jc
csklec973pMvfelL6b3n/vvvz6c//encd999Jd9b0RwAuwKqyRTVZIpqMkUleWJSfu3Xfi0rV67M
qlWr8kd/9Ef5wAc+sL9o/s7v/E4e8YhHZO3atbn44ovzqle96qDHX3TRRfna1752xJfNPtzvxDzU
fbNv++AHP5if+qmfyplnnpm1a9fmz//8z5MkT33qU3P55Zfnt37rt7JmzZo8/vGPzwc+8IGR/t6j
WFH2lQAAAMbi8MVrXL71rW897P0nnHBCrr322ofc9sd//McPOT711FNzyimn5NnPfvbDfq2f/OQn
h7x9/fr1B9134G2rV6/OlVdeecjHP//5z8/zn//8h/3e89UOfPvb0i/eWl/Irw8AACxdrbWDfl3H
UvHjH/84L3/5y3PWWWflD//wDyd9Okd0uH+LmdsPav5eOgsAADBG3/zmN7N69ers3Lkzb37zmyd9
OgtC0RwAuwKqyRTVZIpqMkUleWKxecITnpD77rsv119/fY4//vhJn86CUDQBAAAoZaMJAAAM0lLe
aC42NpoAAABMlKI5AHYFVJMpqskU1WSKSvIEw6NoAgAAUMpGEwAAGKSlutFctmxZtm/fnsc97nHZ
uHFjTjnllPzJn/zJUX/dt7/97fmP//iPXH755QVn+VA2mgAAwJLVWlvwP6O4/vrr84xnPCNTU1M5
4YQT8iu/8iv58pe/PO+/z6FceeWVWb58eVauXJlVq1blrLPOyqc//enDfq3LLrtsQUrmfKyY9Amw
d1cwPT096dNgCZEpqskU1WSKSvJ0DNo02a/9ve99Ly9+8Yvz13/91zn//PPzox/9KF/4whdy3HHH
zetbPtxV22c+85n5/Oc/n957/vIv/zLnn39+vvOd72TVqlUP+byf/OQnWb58+by+/0JwRRMAAGAO
brrpprTWcsEFF6S1lkc+8pE555xz8qQnPWn/51xxxRV54hOfmDVr1uQFL3hBvv3tb8/re+0roa21
XHzxxfnBD36Q7du3Z9OmTXnZy16WCy+8MKtWrcqVV16ZTZs25cILL9z/2H1XXVevXp1169blqquu
SpL86Ec/ylve8paceuqpOfHEE/P6178+P/zhD4/iGTmYojkA/j9wVJMpqskU1WSKSvLEuJ1xxhlZ
vnx5Nm7cmM985jPZvXv3Q+6/5ppr8va3vz2f+MQncvfdd+dZz3pWXvGKVxzV93zggQfyN3/zN1m5
cmVOP/30JMknP/nJ/MZv/EbuueeevPKVr3zIS3BvvvnmvOhFL8qb3vSm3H333dm6dWs2bNiQJLn0
0kuzffv23HDDDdm+fXtuu+22vO1tbzuq8zuQogkAADAHK1euzPXXX5/WWi655JL87M/+bF7ykpfk
zjvvTJK85z3vyWWXXZYzzjgjy5Yty2WXXZatW7fmlltumfP3+uIXv5jVq1fnpJNOykc/+tF84hOf
yMqVK5Mkz3jGM3LuuecmSR75yEc+5CW4H/7wh3POOefkggsuyPLly7NmzZr8wi/8Qnrvufzyy/Pu
d787U1NTOf7443PZZZflIx/5SMEz8yBFcwD87ieqyRTVZIpqMkUleWISzjzzzLz//e/PLbfckq9/
/ev5zne+kze/+c1J9l5NfNOb3pTVq1dn9erVOeGEE5Ikt91225y/z9lnn53du3fnrrvuyj//8z/n
uc997v77Tj755MM+7pZbbsnjHve4g26/66678v3vfz9PfepT95/fC1/4wtx9991zPreHo2gCAAAc
hTPOOCMXXXRRvv71rydJ1q1bl/e+973ZvXv3/j/3339/zj777LLveaR3yF23bl3+/d///aDbH/OY
x+RRj3pUtm3btv/c9uzZk+9973tl55YomoNgV0A1maKaTFFNpqgkT4zbv/3bv+Xd7373/iuUt9xy
S66++uo8/elPT5K87nWvy5/+6Z9m27ZtSZJ77rknH//4xw/5teb7e0KP9Ljf/M3fzD/+4z/m4x//
eB544IF897vfzQ033JBly5blkksuyZvf/ObcddddSfZeaf3sZz87r/M4HEUTAABgDlauXJl/+Zd/
yS//8i/n+OOPz9Of/vQ8+clPzrve9a4kyXnnnZe3vvWtefnLX55Vq1blSU96Uq699tr9j599JfLh
rkzO9b7Zt61bty5///d/n3e961054YQTctZZZ+WrX/1qkuSd73xnfv7nfz5nn312Vq1alXPOOSc3
3XTT/J+QQ53ffBv0SF+8tb6QX3+p8LufqCZTVJMpqskUleRp6WqtHXTl7uFeLlpFhznYof4tZt1+
0D/KirGcFQAAQAElcHFwRRMAABikw11FY/zmekXTRhMAAIBSiuYA+N1PVJMpqskU1WSKSvIEw6No
AgAAUMpGEwAAGCQbzeHwrrMAAMCSMY5fZ0I9L50dALsCqskU1WSKajJFJXlaunrvE/nzuc99bmLf
e8h/5kLRBAAAoJSNJgAAAPPi92gCAAAwFormANgVUE2mqCZTVJMpKskT1WTq6CmaAAAAlLLRBAAA
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
AAClFE1Ygmw0AQCYJEUTAACAUoomLEE2mgAATJKiCQAAQClFE5YgG00AACZJ0QQAAKCUoglLkI0m
AACTpGjfF3A8AAAdJ0lEQVQCAABQStGEJchGEwCASVI0AQAAKLVi0icA1GutTfoUDqn3PulTAABg
DBRNWKo2TfoEDrBp0icAAMC4eOksAAAApRRNAAAASimaAAAAlFI0AQAAKKVoAgAAUErRBAAAoJSi
CQAAQClFEwAAgFKKJgAAAKUUTQAAAEopmgAAAJRSNAEAACilaAIAAFBK0QQAAKCUogkAAEApRRMA
AIBSiiYAAAClFE0AAABKKZoAAACUUjQBAAAopWgCAABQStEEAACglKIJAABAKUUTAACAUoomAAAA
pRRNAAAASimaAAAAlFI0AQAAKKVoAgAAUErRBAAAoJSiCQAAQClFEwAAgFKKJgAAAKUUTQAAAEop
mgAAAJRSNAEAACilaAIAAFBK0QQAAKCUogkAAEApRRMAAIBSRyyarbVTWmufa619o7X29dba/zZz
+5rW2nWttZtaa59trU0t/OkCAAAwdKNc0fxxkt/pvf+vSc5O8sbW2hOSXJrkut776Uk2zxwDAABw
jDti0ey939F73zrz8X1JvpnksUnOTXLVzKddleS8hTpJAAAAFo85bTRba+uTnJXkX5Ks7b3vnLlr
Z5K1pWcGAADAorRi1E9srR2f5P9O8qbe+72ttf339d57a60f6nEbN27M+vXrkyRTU1PZsGFDpqen
kyRbtmxJkrEfP2jf8fSEj/OQ85v08+N4aRznW3v/k9MyjOOZcxzK8zP04+H8fNp37N/P8QL+7/Gk
fz7tO54xlOdnqMd7bclwfj7tO545Gtjz5XhxHu83lJ9PM8dDeH62bt2aPXv2JEl27NiRw2m9H7If
PvSTWvupJJ9K8g+99z+bue3GJNO99ztaaycl+Vzv/cwDHtdH+frjtLcgD+uckpahPU8sbq21ZNOk
z+IAmyLnI/JzimOBn1OLl59RHAv8jBpday2993bg7ctGeGBL8r4k2/aVzBmfTHLRzMcXJfm7ihMF
AABgcRvlpbPPTPKqJF9trX1l5rbLkrwjycdaa69JsiPJ+QtyhgAAACwqRyyavffrc/grn8+rPR0A
AAAWuyO+dBYAAADmQtEEAACglKIJAABAKUUTAACAUoomAAAApRRNAAAASimaAAAAlFI0AQAAKKVo
AgAAUErRBAAAoJSiCQAAQClFEwAAgFKKJgAAAKUUTQAAAEopmgAAAJRSNAEAACilaAIAAFBK0QQA
AKCUogkAAEApRRMAAIBSiiYAAAClFE0AAABKKZoAAACUUjQBAAAopWgCAABQStEEAACglKIJAABA
KUUTAACAUoomAAAApRRNAAAASimaAAAAlFI0AQAAKKVoAgAAUErRBAAAoJSiCQAAQClFEwAAgFKK
JgAAAKUUTQAAAEopmgAAAJRSNAEAACilaAIAAFBK0QQAAKCUogkAAEApRRMAAIBSiiYAAAClFE0A
AABKKZoAAACUUjQBAAAopWgCAABQStEEAACglKIJAABAKUUTAACAUoomAAAApRRNAAAASimaAAAA
lFI0AQAAKKVoAgAAUErRBAAAoJSiCQAAQClFEwAAgFKKJgAAAKUUTQAAAEopmgAAAJRSNAEAACil
aAIAAFBK0QQAAKCUogkAAEApRRMAAIBSiiYAAAClFE0AAABKKZoAAACUUjQBAAAopWgCAABQStEE
AACglKIJAABAKUUTAACAUoomAAAApRRNAAAASimaAAAAlFI0AQAAKKVoAgAAUErRBAAAoJSiCQAA
QClFEwAAgFKKJgAAAKUUTQAAAEopmgAAAJRSNAEAACilaAIAAFBK0QQAAKCUogkAAEApRRMAAIBS
iiYAAAClFE0AAABKKZoAAACUUjQBAAAopWgCAABQStEEAACglKIJAABAKUUTAACAUoomAAAApRRN
AAAASh2xaLbWrmit7WytfW3WbWtaa9e11m5qrX22tTa1sKcJAADAYjHKFc33J3nBAbddmuS63vvp
STbPHAMAAMCRi2bv/QtJdh9w87lJrpr5+Kok5xWfFwAAAIvUfDeaa3vvO2c+3plkbdH5AAAAsMgd
9ZsB9d57kl5wLgAAACwBK+b5uJ2ttRN773e01k5KcufhPnHjxo1Zv359kmRqaiobNmzI9PR0kmTL
li1JMvbjB+07np7wcR5yfpN+fhwvjeN8a+9/clqGcTxzjkN5foZ+PJyfT/uO/fs5XsD/PZ70z6d9
xzOG8vwM9XivLRnOz6d9xzNHA3u+HC/O4/2G8vNp5ngIz8/WrVuzZ8+eJMmOHTtyOG3vBcmH11pb
n+T/6b0/aeb4vyX5bu/9na21S5NM9d4PekOg1lof5euPU2stw7sA2zK054nFrbWWbJr0WRxgU+R8
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
iIiIiIiIKPU/47fNZjhcvpEAAAAASUVORK5CYII=
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[25]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">VEA</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
VEA Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2007-09-27 00:00:00
Account Value: 10000
	Buy Price: 39.47
	Num Shares: 253.0
	Remaining Value: 14.09
Sell Date: 
2008-01-23 00:00:00
	Sell Price: 34.14
	Updated Value: 8651.51

-------------------------

Buy Date: 
2008-05-21 00:00:00
Account Value: 8651.51
	Buy Price: 37.94
	Num Shares: 228.0
	Remaining Value: 1.19
Sell Date: 
2008-06-12 00:00:00
	Sell Price: 35.41
	Updated Value: 8074.67

-------------------------

Buy Date: 
2009-06-03 00:00:00
Account Value: 8074.67
	Buy Price: 24.4
	Num Shares: 330.0
	Remaining Value: 22.67
Sell Date: 
2010-05-17 00:00:00
	Sell Price: 26.39
	Updated Value: 8731.37

-------------------------

Buy Date: 
2010-09-24 00:00:00
Account Value: 8731.37
	Buy Price: 29.79
	Num Shares: 293.0
	Remaining Value: 2.9
Sell Date: 
2011-08-09 00:00:00
	Sell Price: 29.38
	Updated Value: 8611.24

-------------------------

Buy Date: 
2012-02-27 00:00:00
Account Value: 8611.24
	Buy Price: 30.84
	Num Shares: 279.0
	Remaining Value: 6.88
Sell Date: 
2012-05-29 00:00:00
	Sell Price: 27.28
	Updated Value: 7618.0

-------------------------

Buy Date: 
2012-08-17 00:00:00
Account Value: 7618.0
	Buy Price: 30.03
	Num Shares: 253.0
	Remaining Value: 20.41
Sell Date: 
2014-10-03 00:00:00
	Sell Price: 38.47
	Updated Value: 9753.32

-------------------------

Buy Date: 
2015-03-24 00:00:00
Account Value: 9753.32
	Buy Price: 40.83
	Num Shares: 238.0
	Remaining Value: 35.78
Sell Date: 
2015-03-25 00:00:00
	Sell Price: 40.61
	Updated Value: 9700.96

-------------------------

Buy Date: 
2015-04-06 00:00:00
Account Value: 9700.96
	Buy Price: 40.8
	Num Shares: 237.0
	Remaining Value: 31.36
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 40.99
	Updated Value: 9745.99


===============================

VEA:
Final Value Basic: 10821.36
Final Value Crossover: 9745.99




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[26]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[26]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/286.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[27]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5oAAAMeCAYAAAB81HtFAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3XuQ5VVhL/rvGiZBc5kzPYMRuQIOVCKaUyRNjImPeG0s
uWKKEE2MjygwlEVpHh408VQklZQTUxU1p+Ckkls3lIgB9fqI58TjKxENx7lKpTTXWwyiaLyTMAoE
BxFG8RnRdf+YnmaG6Z7p7r36sdZ8PlVdM2vv/dt7fXtNT893fr+1u9RaAwAAAK1sWOsJAAAAMBZF
EwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFlU0SynHlVJuKqV8YHa8o5Ryx+xtN5VSzlvZ
aQIAANCLjYt83GVJbk2yaXZck1xZa71yRWYFAABAt456RrOUckqSX0ry5iTlwM0H/R4AAADmLObS
2f+a5D8n+eFBt9Ukryil3FxKuaaUMrUiswMAAKA7RyyapZTzk9xda70ph57B/KskpyeZTnJXkitW
bIYAAAB0pdRaF76zlD9NcmGSB5I8LMl/SPLfa60XHfSYbUk+UGs9a57jF35yAAAAuldrPWxb5RHP
aNZa/6DWemqt9fQkL0zyP2utF5VSTj7oYc9NcssRnmPVPi6++OJVfT3Z5JNPvt4/Rs4mX/8f8vX7
MXI2+fr/kK/tx0IW+66zyf5LZw8805+VUn5mdnxbkpct4XlWzLZt29Z6Citm5GyJfL2Tr18jZ0vk
6518/Ro5WyJf7+RbHYsumrXWnUl2zv7+whWaDwAAAJ1bzLvOdmNqatw3vx05WyJf7+Tr18jZEvl6
J1+/Rs6WyNc7+VbHUEVzenp6raewYkbOlsjXO/n6NXK2RL7eydevkbMl8vVOvtVxxHednfjJS6kr
+fwAAMC4SjnszUxZQ/N1u1JK6jzvOruUNwMCAABYVU5crQ9LLf1DXTq7c+fOtZ7Cihk5WyJf7+Tr
18jZEvl6J1+/Rs6WyAeLMVTRBAAAYO3ZowkAAKxLs/v/1noaZOG1WGiPpjOaAAAAg/jyl7+cTZs2
rXlBH6pojnw9+cjZEvl6J1+/Rs6WyNc7+fo1crZEvrVWSlnxj8XYtm1bfuzHfiybNm3K1q1bc/75
5+eOO+5YkcwbNmzICSeckE2bNuWUU07J7/3e7+WHP/zhvI897bTTcv/996/5O/YOVTQBAIBjQV3B
j8UppeSDH/xg7r///tx111056aST8opXvKJJuvl85jOfyf33358bbrgh73jHO3L11Vcf9pgHHnhg
xV5/qYYqmjMzM2s9hRUzcrZEvt7J16+RsyXy9U6+fo2cLZGPwx1//PH5tV/7tdx6661zt83MzOSa
a66ZG1977bV52tOeliT57d/+7bz61a8+5DkuuOCC/Pmf//lRX+vMM8/M0572tHzuc5/Ll770pWzY
sCFvectb8pjHPCbPfOYz5247cMbz3nvvzSWXXJJHP/rR2bp1a5773OfOPdcHP/jBTE9PZ8uWLXnq
U5+aW265ZaLPw8GGKpoAAACr5cA+yG9/+9t597vfnSc/+clz9x3pMtzt27fnne9859zx99xzT264
4Ya8+MUvPupr3XrrrfnEJz6Rs88+e+6+j3/84/nCF76Q66+//rC9mRdeeGG++93v5tZbb83dd9+d
3/3d302S3HTTTXnpS1+aq6++Ovfee29e9rKX5YILLsi///u/L+MzcbihiuZ6v558EiNnS+TrnXz9
GjlbIl/v5OvXyNkS+div1prnPOc52bJlS6ampnLDDTccdpZyIU984hOzefPm3HDDDUmSd73rXTnn
nHPy4z/+4wse87M/+7PZunVrLrjgglx66aW55JJL5krljh078vCHPzzHH3/8Icfcdddd+fCHP5yr
rroqmzdvzsaNG+fOqr7pTW/Ky172sjzxiU9MKSUXXXRRjj/++Hzyk59czqfjMEMVTQAAgNVQSsn7
3ve+3Hffffne976Xv/zLv8zTn/703H333Ys6/qKLLsrb3/72JMnb3/72XHjhhUd8/E033ZR77703
u3fvzute97pD7jv11FPnPeb222/P1q1bs3nz5sPu+9KXvpQrrrgiW7Zsmfu44447ctdddy1q/kfj
52gCAADr0nw/u3H/5agr2TEW97M7Tz/99FxzzTV5xjOeMXfbIx/5yFx11VX51V/91Zx//vl51rOe
NfcGQW94wxvyoQ99KJ/4xCeSJHfccUfOOuus7Ny5M09/+tOzd+/ew85IHrBhw4bs3r07Z5xxxiG3
79mzJ2eccUYeeOCBbNiw4bDb9u7dm1NOOSX33nvvYWXz5S9/eU477bT8wR/8weI+K36OJgAAwMo7
ULxqrXNnNx//+McnSaanp/O3f/u3+c53vpPdu3fnmmuuOWTP5imnnJKf+7mfy0UXXZTnPe95C5bM
SZx88sl59rOfnd/6rd/Kvn378v3vfz8f//jHkySXXnpprrrqqvzTP/1Taq351re+lQ996EP55je/
2eS1hyqaI19PPnK2RL7eydevkbMl8vVOvn6NnC2Rjwf98i//cjZt2pTNmzfnj/7oj/LWt751rmi+
6lWvyo/+6I/mpJNOyiWXXJKXvOQlhx1/8cUX55ZbbjnqZbNH+pmY89138G1ve9vb8iM/8iN53OMe
l5NOOil/8Rd/kSR5whOekKuvvjq/8zu/k61bt+Ynf/In89a3vnVRuRdjY7NnAgAAWBULF6/Vcttt
tx3x/hNPPDHXX3/9Ibe99rWvPWT8mMc8Jqeeemqe/vSnH/G5fvCDH8x7+7Zt2w6776G3bdmyJdde
e+28xz/rWc/Ks571rCO+9nLZowkAAKxLC+0LHMH3v//9vPCFL8zZZ5+dP/zDP1zr6RyVPZoAAADr
2Oc///ls2bIle/fuzStf+cq1ns6KGKpojnw9+cjZEvl6J1+/Rs6WyNc7+fo1crZEPib3+Mc/Pt/8
5jdz44035oQTTljr6ayIoYomAAAAa88eTQAAYF0aeY9mb+zRBAAAYE0NVTRHvp585GyJfL2Tr18j
Z0vk6518/Ro5WyIfLMZQRRMAAIC1Z48mAACwLo26R3PDhg3ZvXt3zjjjjGzfvj2nnnpq/uRP/mTi
533961+ff/3Xf83VV1/dYJaHskcTAAAYVillxT8W48Ybb8xTnvKUTE1N5cQTT8wv/uIv5tOf/vSy
88zn2muvzXHHHZdNmzZl8+bNOfvss/OhD31owee6/PLLV6RkLsdQRXPk68lHzpbI1zv5+jVytkS+
3snXr5GzJfKtCztW8GMRvvGNb+T888/PZZddlvvuuy933nlnXvva1+b4449fcpQkRzxr+9SnPjX3
339/9u3bl5e+9KV5/vOfn69//euHPe4HP/jBsl57pQxVNAEAAFbaF7/4xZRS8oIXvCCllDzsYQ/L
ueeem7POOmvuMW95y1vyUz/1U9m6dWvOO++8fPnLX17Wax0ooaWUXHLJJfnOd76T3bt3Z8eOHXne
856XCy+8MJs3b861116bHTt25MILL5w79sBZ1y1btuS0007LddddlyT53ve+l1e/+tV5zGMek0c9
6lH5zd/8zXz3u9+d4DNyuKGK5szMzFpPYcWMnC2Rr3fy9WvkbIl8vZOvXyNnS+QjOfPMM3Pcccdl
+/bt+fCHP5z77rvvkPvf97735fWvf33e+9735p577snTnva0vOhFL5roNR944IG8+c1vzqZNm/LY
xz42SfL+978/v/7rv56vf/3refGLX3zIJbhf+tKX8ku/9Eu57LLLcs8992TXrl2Znp5OkrzmNa/J
7t27c/PNN2f37t25884787rXvW6i+T3UUEUTAABgpW3atCk33nhjSim59NJL88hHPjK/8iu/krvv
vjtJctVVV+Xyyy/PmWeemQ0bNuTyyy/Prl27cvvtty/5tT75yU9my5YtOfnkk/Pud787733ve7Np
06YkyVOe8pRccMEFSZKHPexhh1yC+453vCPnnntuXvCCF+S4447L1q1b8zM/8zOptebqq6/OlVde
mampqZxwwgm5/PLL8653vavBZ+ZBQxXNLq4nX6aRsyXy9U6+fo2cLZGvd/L1a+RsiXzs97jHPS5/
/dd/ndtvvz2f/exn82//9m955StfmWT/2cTLLrssW7ZsyZYtW3LiiScmSe68884lv86TnvSk3Hff
ffnqV7+af/zHf8wznvGMuftOOeWUBY+7/fbbc8YZZxx2+1e/+tV8+9vfzhOe8IS5+T372c/OPffc
s+S5HclQRRMAAGC1nXnmmbn44ovz2c9+Nkly2mmn5U1velPuu+++uY9vfetbedKTntTsNY/2Drmn
nXZa/uVf/uWw2x/xiEfk4Q9/eG699da5ue3bty/f+MY3ms0tGaxojnw9+cjZEvl6J1+/Rs6WyNc7
+fo1crZEPpJ//ud/zpVXXjl3hvL222/PO9/5zjz5yU9Okrz85S/Pn/7pn+bWW29Nknz961/Pe97z
nnmfa7k/J/Rox/3Gb/xG/uEf/iHvec978sADD+RrX/tabr755mzYsCGXXnppXvnKV+arX/1qkv1n
Wj/ykY8sax4LGapoAgAArLRNmzblU5/6VH7hF34hJ5xwQp785Cfnp3/6p3PFFVckSZ7znOfk93//
9/PCF74wmzdvzllnnZXrr79+7viDz0Qe6czkUu87+LbTTjstf/d3f5crrrgiJ554Ys4+++x85jOf
SZK88Y1vzE/8xE/kSU96UjZv3pxzzz03X/ziF5f/CZlvfstt0It68lLqSj7/Q+3cuXPY/4EZOVsi
X+/k69fI2RL5eidfv0bOlsi3mkoph525O9Lloq2sZofpxXxrcdDthy3KxlWZFQAAQANKYB+GOqMJ
AACMY6GzaKy+pZ7RtEcTAACApoYqmiP/zJ+RsyXy9U6+fo2cLZGvd/L1a+RsiXywGEMVTQAAANae
PZoAAMC6ZI/m+uFdZwEAgGGsxo8zob2hLp0d+XrykbMl8vVOvn6NnC2Rr3fy9WvkbIl8q6nW2vzj
Yx/72Io873r5WMl8SzFU0QQAAGDt2aMJAADAsvg5mgAAAKyKoYrmerqevLWRsyXy9U6+fo2cLZGv
d/L1a+RsiXy9k291DFU0AQAAWHv2aAIAALAs9mgCAACwKoYqmuvleuSVMHK2RL7eydevkbMl8vVO
vn6NnC2Rr3fyrY6hiiYAAABrzx5NAAAAlmWhPZob12IyAAAAtFfKYZ1v0VqeJBzq0tn1cj3yShg5
WyJf7+Tr18jZEvl6J1+/Rs6WyNe70fMlSXYs46OxoYomAAAAa88eTQAAjknr5RJDlsf6za+Usrwz
lDuW93mxRxMAAA6znMKx/IJDa9ZvvRrq0tmRr7ceOVsiX+/k69fI2RL5eidfv0bOdiywfrTgjCYA
ADDnnHPOWfaxI1+SytLYowkAwDFp/x6/5V16OfK/cVd7j99yWb/5rZc9mkNdOgsAAMDaG6pojnw9
+cjZEvl6J1+/Rs6WyNc7+fo1cjZgcYYqmgAAAKy9Re3RLKUcl+TTSe6otf5yKWVrkncneUySPUme
X2vdN89x9mgCALAu2eM3P3s0+9bbHs3LktyaB1fyNUk+Wmt9bJIbZscAAABw9KJZSjklyS8leXMe
/OmmFyS5bvb31yV5zorMbolG3g8wcrZEvt7J16+RsyXy9U6+fo2cDVicxZzR/K9J/nOSHx5020m1
1r2zv9+b5KTWEwMAAKBPG490Zynl/CR311pvKqXMzPeYWmstpSx4Me/27duzbdu2JMnU1FSmp6cz
M7P/qQ78b1er8YHbVur513I8MzOzruYjn3zyGRsbGxsfaXzAepnPQuPkwHyXOs66mP9Kr19um/31
9MWNrd/6GM9ZgfXbtWtX9u3b//Y8e/bsyUKO+GZApZQ/TXJhkgeSPCzJf0jyt0memGSm1vqVUsrJ
ST5Wa33cPMd7MyAAANYlbyYzP28G1Lcu3gyo1voHtdZTa62nJ3lhkv9Za70wyfuTXDz7sIuT/I8l
z2gFHNbgBzJytkS+3snXr5GzJfL1Tr5+jZwNWJwjFs15HKi4b0hybinli0meMTsGAACAxf0czWU/
uUtnAQBYp1x6OT+Xzvati0tnAQAAYKmGKpoj7wcYOVsiX+/k69fI2RL5eidfv0bOBizOUEUTAACA
tbcu92juv956eUa+3hoAgHbs8ZufPZp9Wy97NDcuYwqrZHl/aAAAAFhbLp3txOh7HeTrm3z9Gjlb
Il/v5OvXyNmAxVE0AQAAaGod79F0vTUAACvHvznnZ49m39bLHk1nNAEAAGhK0ezE6Hsd5OubfP0a
OVsiX+/k69fI2YDFUTQBAABoyh5NAACOSf7NOT97NPtmjyYAAABDUjQ7MfpeB/n6Jl+/Rs6WyNc7
+fo1cjZgcRRNAAAAmrJHEwCAY5J/c87PHs2+2aMJAADAkBTNToy+10G+vsnXr5GzJfL1Tr5+jZwN
WJyNaz0BAADGcs455yz72JEvaYRjiT2aAAA0ZY9f36xf3+zRBAAAYEiKZidG3+sgX9/k69fI2RL5
eicfQL8UTQAAAJqyRxMAgKbs8eub9eubPZoAAAAMSdHsxOj7OOTrm3z9GjlbIl/v5APol5+jSVP7
L2FYnpEvYQAAgGOJPZo0Ze0AAHv8+mb9+maPJgAAAENSNDthH0ffRl8/+fo1crZEvt7JB9AvRRMA
AICm7NGkKWsHANjj1zfr1zd7NAEAABiSotkJ+zj6Nvr6ydevkbMl8vVOPoB+KZoAAAA0ZY8mTVk7
AMAev75Zv77ZowkAAMCQFM1O2MfRt9HXT75+jZwtka938gH0S9EEAACgKXs0acraAQD2+PXN+vXN
Hk0AAACGpGh2wj6Ovo2+fvL1a+RsiXy9kw+gX4omAAAATdmjSVPWDgCwx69v1q9v9mgCAAAwJEWz
E/Zx9G309ZOvXyNnS+TrnXwA/VI0AQAAaMoeTZqydgCAPX59s359s0cTAACAISmanbCPo2+jr598
/Ro5WyJf7+QD6JeiCQAAQFP2aNKUtQMA7PHrm/Xrmz2aAAAADEnR7IR9HH0bff3k69fI2RL5eicf
QL8UTQAAAJqyR5OmrB0AYI9f36xf3+zRBAAAYEiKZifs4+jb6OsnX79GzpbI1zv5APqlaAIAANCU
PZo0Ze0AAHv8+mb9+maPJgAAAENSNDthH0ffRl8/+fo1crZEvt7JB9AvRRMAAICm7NGkKWsHANjj
1zfr17f1skdz4zKmACzR/r8Il2fkvwgBABjTUS+dLaU8rJTyqVLKrlLKraWU18/evqOUckcp5abZ
j/NWfrrHLvs4BrBjGR+dGP3P58j5Rs6WyNc7+QD6ddQzmrXW75ZSzqm1fruUsjHJjaWUX8z+89RX
1lqvXPFZAgAA0I0l7dEspfxYkv87yfYkz0vyzVrrFUd4vD2axxhrN79e9joAQAu9fN/z75b5Wb++
rZc9mot619lSyoZSyq4ke5N8rNb6udm7XlFKubmUck0pZWrJswIAAGA4iyqatdYf1lqnk5yS5H8r
pcwk+askpyeZTnJXkgXPbDI5+zhYz0b/8zlyvpGzJfL1Tj6Afi3pXWdrrV8vpXwoyc/VWnceuL2U
8uYkH5jvmO3bt2fbtm1JkqmpqUxPT2dmZibJg3/BPnT8oAPjmUWO9z/H0Z7feGXHDzownlnUeL3M
f6XGuW027ulZ2njWWs/feMzxAetlPvLJJ9844zlL/P632vNNDsx3qeO1ma/1O3Rs/eYfz1mB9du1
a1f27duXJNmzZ08WctQ9mqWURyR5oNa6r5Ty8CTXJ/njJJ+rtX5l9jGvSvLEWutvPORYezSPMdZu
fr3sdQCAFnr5vuffLfOzfn1bL3s0F3NG8+Qk15VSNmT/pbZvq7XeUEp5ayllOvtX97YkL1vyrAAA
ABjOhqM9oNZ6S631Z2ut07XWn661/pfZ2y+aHf9MrfU5tda9Kz/dY9dhp8FhHRn9z+fI+UbOlsjX
O/kA+nXUogkAAABLsaSfo7nkJ7dH85hj7ebXy14HAGihl+97/t0yP+vXt/WyR9MZTQAAAJpSNDth
Hwfr2eh/PkfON3K2RL7eyQfQL0UTAACApuzRpClrN79e9joAQAu9fN/z75b5Wb++2aMJAADAkBTN
TtjHwXo2+p/PkfONnC2Rr3fyAfRr41pPgMU555xzln3syJcGAAAA6489mp1wrXzfelk/AGihl+97
/t0yP+vXN3s0AQAAGJKiCUxs9H1GI+cbOVsiX+/kA+iXogkAAEBTiiYwsZmZmbWewooaOd/I2RL5
eicfQL8UTQAAAJpSNIGJjb7PaOR8I2dL5OudfAD9UjQBAABoStEEJjb6PqOR842cLZGvd/IB9EvR
BAAAoClFE5jY6PuMRs43crZEvt7JB9AvRRMAAICmFE1gYqPvMxo538jZEvl6Jx9AvxRNAAAAmlI0
gYmNvs9o5HwjZ0vk6518AP1SNAEAAGhK0QQmNvo+o5HzjZwtka938gH0S9EEAACgKUUTmNjo+4xG
zjdytkS+3skH0C9FEwAAgKYUTWBio+8zGjnfyNkS+XonH0C/FE0AAACaUjSBiY2+z2jkfCNnS+Tr
nXwA/VI0AQAAaErRBCY2+j6jkfONnC2Rr3fyAfRL0QQAAKApRROY2Oj7jEbON3K2RL7eyQfQL0UT
AACAphRNYGKj7zMaOd/I2RL5eicfQL8UTQAAAJpSNIGJjb7PaOR8I2dL5OudfAD9UjQBAABoStEE
Jjb6PqOR842cLZGvd/IB9EvRBAAAoClFE5jY6PuMRs43crZEvt7JB9AvRRMAAICmFE1gYqPvMxo5
38jZEvl6Jx9AvxRNAAAAmlI0gYmNvs9o5HwjZ0vk6518AP1SNAEAAGhK0QQmNvo+o5HzjZwtka93
8gH0S9EEAACgKUUTmNjo+4xGzjdytkS+3skH0C9FEwAAgKYUTWBio+8zGjnfyNkS+XonH0C/FE0A
AACaUjSBiY2+z2jkfCNnS+TrnXwA/VI0AQAAaErRBCY2+j6jkfONnC2Rr3fyAfRr41pPAACOdaWU
ZR9ba204EwBowxlNYGKj7zMaOd/I2ZLe8tVlfIytr/VbutHzAcc2RRMAAICmFE1gYqPvMxo538jZ
kvHzjW709Rs9H3BsUzQBAABoStEEJjb6PqOR842cLRk/3+hGX7/R8wHHNkUTAACApo5YNEspDyul
fKqUsquUcmsp5fWzt28tpXy0lPLFUspHSilTqzNdYD0afZ/RyPlGzpaMn290o6/f6PmAY9sRi2at
9btJzqm1Tif56STnlFJ+Mclrkny01vrYJDfMjgEAAODol87WWr89+9sfTXJckvuSXJDkutnbr0vy
nBWZHdCF0fcZjZxv5GzJ+PlGN/r6jZ4POLYdtWiWUjaUUnYl2ZvkY7XWzyU5qda6d/Yhe5OctIJz
BAAAoCMbj/aAWusPk0yXUjYnub6Ucs5D7q+llLpSEwTWv9H3GY2cb+Rsyfj5Rjf6+o2eDzi2HbVo
HlBr/Xop5UNJnpBkbynlUbXWr5RSTk5y90LHbd++Pdu2bUuSTE1NZXp6eu4v1gOXjDx0/KAD45lF
jvc/x9Gev9dxbpsNeXqWNp61WvM96BVnf51Z1HitP7/Wz9jYeM3+fth/axb//e7AOOti/sf6uJSS
5aq1rvn8V2o8Z4nf/1b/6+/AfJc6Xpv5Wr9Dx9Zv/vGcFVi/Xbt2Zd++fUmSPXv2ZCGl1oVPRpZS
HpHkgVrrvlLKw5Ncn+SPkzwryddqrW8spbwmyVSt9bA3BCql1CM9/xFeN8lyTpKWLOf1elBKSXYs
48AdWdXPibWbXy/rt1w7d+486C/88Yycb+RsST/5/N05P+vXr16+71m7+Vm/vq32+pVSUms97H/c
jnZG8+Qk15VSNmT/fs631VpvKKXclORvSikvTbInyfOXPCMAAACGdMSiWWu9JcnPznP7vUmeuVKT
AvrSwxmHSfSSb7mX7438v7q9rB3zs34A/Vr0Hk0AerDU0rj8vWUAAAvZsNYTAPp32MbzwYyeb2TW
rm/WD6BfiiYAAABNKZrAxEbfRzV6vpFZu75ZP4B+KZoAAAA0pWgCExt9H9Xo+UZWSln2B2vP1x5A
v7zrLABj27FKxwAAc5zRBCY2+j6q0fPBeuVrD6BfiiYAAABNKZrAxEbfRzV6PlivfO0B9EvRBAAA
oClFE5jY6PuoRs8H65WvPYB+KZoAAAA0pWgCExt9H9Xo+WC98rUH0C9FEwAAgKYUTWBio++jGj0f
rFe+9gD6pWgCAADQlKIJTGz0fVSj54P1ytceQL8UTQAAAJpSNIGJjb6PavR8sF752gPol6IJAABA
U4omMLHR91GNng/WK197AP1SNAEAAGhK0QQmNvo+qtHzwXrlaw+gX4omAAAATSmawMRG30c1ej5Y
r3ztAfRL0QQAAKApRROY2Oj7qEbPB+uVrz2AfimaAAAANKVoAhMbfR/V6PlgvfK1B9AvRRMAAICm
FE1gYqPvoxo9H6xXvvYA+qVoAgAA0JSiCUxs9H1Uo+eD9crXHkC/FE0AAACaUjSBiY2+j2r0fLBe
+doD6NfGtZ4AAMB8SinLPrbW2nAmACyVoglMbOfOnUOfeRg9H6xrO1bpGACacuksAAAATSmawMRG
P9s3ej4AgNYUTQAAAJpSNIGJjf6z7kbPBwDQmqIJAABAU4omMLHR9zCOng8AoDVFEwAAgKYUTWBi
o+9hHD0fAEBriiYAAABNKZrAxEbfwzh6PgCA1hRNAAAAmlI0gYmNvodx9HwAAK1tXOsJAKx355xz
zrKPrbU2nAkAQB8UTWBix8Qexh2rdAwAwABcOgsAAEBTiiYwMXsYAQA4mKIJAABAU4omMLFjYo8m
AACLpmgCAADQlKIJTMweTQAADqZoAgAA0JSiCUzMHk0AAA6maAIAANCUoglMzB5NAAAOpmgCAADQ
lKIJTMweTQAADqZoAgAA0JSiCUzMHk0AAA521KJZSjm1lPKxUsrnSimfLaX8p9nbd5RS7iil3DT7
cd7KTxdc/T7GAAAgAElEQVQAAID1buMiHvP9JK+qte4qpZyQ5P8tpXw0SU1yZa31yhWdIbDu2aMJ
AMDBjlo0a61fSfKV2d9/s5Ty+SSPnr27rODcAAAA6NCS9miWUrYlOTvJJ2dvekUp5eZSyjWllKnG
cwM6YY8mAAAHW8yls0mS2ctm/1uSy2bPbP5VktfN3v0nSa5I8tKHHrd9+/Zs27YtSTI1NZXp6em5
y+wO/OP0oeMHHRjPLHK8/zmO9vy9jnPbbMjTs7TxrNWa70GvOPvrzKLGa/35tX7GRxr3sn4HveLs
rzNHGa/u/FZ7PGep65fV/X4y+4pZ/Pe7A+MH57qS87N+Rx7PvmKs36HjOUtcv9We71L/vWL9jjy2
futjPGcF1m/Xrl3Zt29fkmTPnj1ZSKm1Lnjn3INK+ZEkH0zy97XWP5/n/m1JPlBrPesht9fFPP88
z5f9W0CXfGSW83o9KKUkO5Zx4I6s6ufE2s2vl/Vjfr2s3/K+/nztzWtHD2uXWL8F7LB+a83a9c36
9W2116+UklrrYVsqNyziwJLkmiS3HlwySyknH/Sw5ya5ZcmzAgAAYDhHLZpJnprkJUnOOehHmTw7
yRtLKZ8ppdyc5OlJXrWSEwXWr8Mu0wAA4Ji2mHedvTHzF9K/bz8dAAAAereYM5oAR3ToG2IAAHCs
UzQBAABoStEEJmaPJgAAB1M0AQAAaOqobwYEHDv2/zSj5Rn551EBALA0iibwEMv7wccAAHCAS2cB
AABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQA
AKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAA
gKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAA
mlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABo
StEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKAp
RRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYU
TQAAAJpSNAEAAGhK0QQAAKApRRMAAICmjlo0SymnllI+Vkr5XCnls6WU/zR7+9ZSykdLKV8spXyk
lDK18tMFAABgvVvMGc3vJ3lVrfU/JnlSkt8upTw+yWuSfLTW+tgkN8yOAQAAOMYdtWjWWr9Sa901
+/tvJvl8kkcnuSDJdbMPuy7Jc1ZqkgAAAPRjSXs0Synbkpyd5FNJTqq17p29a2+Sk5rODAAAgC4t
umiWUk5I8t+TXFZrvf/g+2qtNUltPDcAAAA6tHExDyql/Ej2l8y31Vr/x+zNe0spj6q1fqWUcnKS
u+c7dvv27dm2bVuSZGpqKtPT05mZmUmS7Ny5M0kOGz/owHhmkeP9z3G05+91nNtmQ56epY1nrdZ8
D3rF2V9nFjVe68+v9dt56Atav0PG467f6s5vtcdzlrp+Wd3vJ7OvmMV/vzswfnCuKzk/63fk8ewr
xvodOp6zxPVb7fku9fud9Tvy2Pqtj/GcFVi/Xbt2Zd++fUmSPXv2ZCFl/8nIhZVSSvbvwfxarfVV
B93+Z7O3vbGU8pokU7XW1zzk2Hq051/gNbO8E6Qly3m9HpRSkh3LOHBHVvVzYu3mZ/36Nvb6Wbt5
7ehh7RLrt4Ad1m+tWbu+Wb++rfb6lVJSay0PvX0xZzSfmuQlST5TSrlp9rbLk7whyd+UUl6aZE+S
5y95VgAAAAznqEWz1npjFt7L+cy20wEAAKB3CxVIAAAAWBZFEwAAgKYUTQAAAJpSNAEAAGhK0QQA
AKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAA
gKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAA
mlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABo
StEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKAp
RRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYU
TQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0
AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmjlo0SylvKaXsLaXcctBt
O0opd5RSbpr9OG9lpwkAAEAvFnNG86+TPLRI1iRX1lrPnv34cPupAQAA0KOjFs1a6yeS3DfPXaX9
dAAAAOjdJHs0X1FKubmUck0pZarZjAAAAOjaxmUe91dJXjf7+z9JckWSl873wO3bt2fbtm1Jkqmp
qUxPT2dmZiZJsnPnziQ5bPygA+OZRY73P8fRnr/XcW6bDXl6ljaetVrzPegVZ3+dWdR4rT+/1m/n
oS9o/Q4Zj7t+qzu/1R7PWer6ZXW/n8y+Yhb//e7A+MG5ruT8rN+Rx7OvGOt36HjOEtdvtee71O93
1u/IY+u3PsZzVmD9du3alX379iVJ9uzZk4WUWuuCd849qJRtST5Qaz1riffVxTz/PMdl/zbQJR+Z
5bxeD0opyY5lHLgjq/o5sXbzs359G3v9rN28dvSwdon1W8AO67fWrF3frF/fVnv9SimptR62rXLD
MqaQUsrJBw2fm+SWhR4LAADAseWol86WUt6Z5OlJHlFKuT3Ja5PMlFKms/+/EG5L8rIVnSUAAADd
OGrRrLW+aJ6b37ICcwEAAGAAy7p0FgAAABaiaAIAANCUogkAAEBTiiYAAABNKZoAAAA0pWgCAADQ
lKIJAABAU4omAAAATSmaAAAANKVoAgAA0JSiCQAAQFOKJgAAAE0pmgAAADSlaAIAANCUogkAAEBT
iiYAAABNKZoAAAA0pWgCAADQlKIJAABAU4omAAAATSmaAAAANKVoAgAA0JSiCQAAQFOKJgAAAE0p
mgAAADSlaAIAANCUogkAAEBTiiYAAABNKZoAAAA0pWgCAADQlKIJAABAU4omAAAATSmaAAAANKVo
AgAA0JSiCQAAQFOKJgAAAE0pmgAAADSlaAIAANCUogkAAEBTiiYAAABNKZoAAAA0pWgCAADQlKIJ
AABAU4omAAAATSmaAAAANKVoAgAA0JSiCQAAQFOKJgAAAE0pmgAAADSlaAIAANCUogkAAEBTiiYA
AABNKZoAAAA0pWgCAADQlKIJAABAU4omAAAATSmaAAAANKVoAgAA0JSiCQAAQFOKJgAAAE0pmgAA
ADSlaAIAANCUogkAAEBTiiYAAABNKZoAAAA0ddSiWUp5SyllbynlloNu21pK+Wgp5YullI+UUqZW
dpoAAAD0YjFnNP86yXkPue01ST5aa31skhtmxwAAAHD0ollr/USS+x5y8wVJrpv9/XVJntN4XgAA
AHRquXs0T6q17p39/d4kJzWaDwAAAJ2b+M2Aaq01SW0wFwAAAAawcZnH7S2lPKrW+pVSyslJ7l7o
gdu3b8+2bduSJFNTU5mens7MzEySZOfOnUly2PhBB8Yzixzvf46jPX+v49w2G/L0LG08a7Xme9Ar
zv46s6jxWn9+rd/OQ1/Q+h0yHnf9Vnd+qz2es9T1y+p+P5l9xSz++92B8YNzXcn5Wb8jj2dfMdbv
0PGcJa7fas93qd/vrN+Rx9ZvfYznrMD67dq1K/v27UuS7NmzJwsp+09IHlkpZVuSD9Raz5od/1mS
r9Va31hKeU2SqVrrYW8IVEqpi3n+eY7L8k6Slizn9XpQSkl2LOPAHVnVz4m1m5/169vY62ft5rWj
h7VLrN8Cdli/tWbt+mb9+rba61dKSa21PPT2DYs48J1J/jHJmaWU20splyR5Q5JzSylfTPKM2TEA
AAAc/dLZWuuLFrjrmY3nAgAAwACOekYTAAAAlkLRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQA
AKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAA
gKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAA
mlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABo
StEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKAp
RRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYU
TQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0
AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhq4yQHl1L2JPlGkh8k+X6t9edbTAoAAIB+TVQ0
k9QkM7XWe1tMBgAAgP61uHS2NHgOAAAABjFp0axJ/qGU8ulSyqUtJgQAAEDfJr109qm11rtKKT+e
5KOllC/UWj/RYmIAAAD0aaKiWWu9a/bXr5ZS3pvk55McUjS3b9+ebdu2JUmmpqYyPT2dmZmZJMnO
nTuT5LDxgw6MZxY53v8cR3v+Xse5bTbk6VnaeNZqzfegV5z9dWZR47X+/Fq/nYe+oPU7ZDzu+q3u
/FZ7PGep65fV/X4y+4pZ/Pe7A+MH57qS87N+Rx7PvmKs36HjOUtcv9We71K/31m/I4+t3/oYz1mB
9du1a1f27duXJNmzZ08WUmqtC955JKWUH0tyXK31/lLK/5LkI0n+uNb6kYMeU5fz/KWU7L8qd8lH
Zrl51rtSSrJjGQfuyKp+Tqzd/Kxf38ZeP2s3rx09rF1i/Raww/qtNWvXN+vXt9Vev1JKaq2HvW/P
JGc0T0ry3v0LnI1J/q+DSyYAAADHpmUXzVrrbUmmG84FAACAAWxY6wkAAAAwFkUTAACAphRNAAAA
mlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABo
StEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKAp
RRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYU
TQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0
AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMAAICmFE0AAACaUjQBAABoStEE
AACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYUTQAAAJpSNAEAAGhK0QQAAKApRRMA
AICmFE0AAACaUjQBAABoStEEAACgKUUTAACAphRNAAAAmlI0AQAAaErRBAAAoClFEwAAgKYmKpql
lPNKKV8opfx/pZTfbzUpAAAA+rXsollKOS7J/5HkvCQ/leRFpZTHt5oYAAAAfZrkjObPJ9lda91T
a/1+kncl+ZU20wIAAKBXkxTNRye5/aDxHbO3AQAAcAwrtdblHVjKryU5r9Z66ez4JUl+odb6ioMe
s7wnBwAAoAu11vLQ2zZO8Hx3Jjn1oPGp2X9W84gvCAAAwNgmuXT200l+spSyrZTyo0lekOT9baYF
AABAr5Z9RrPW+kAp5XeSXJ/kuCTX1Fo/32xmAAAAdGnZezQBAABgPpPs0VxTpZQN2f8jVh6dpGb/
ntF/qgM055GzJfL1Tr5+jZwtka938vVr5GyJfL2Tb+10eUazlPK/J/k/k+zOg29AdEqSn0zyW7XW
69dqbpMaOVsin3zr28j5Rs6WyCff+jZyvpGzJfLJt76t93y9Fs0vZP+PVtnzkNtPT/L3tdbHrcnE
Ghg5WyKffOvbyPlGzpbIJ9/6NnK+kbMl8sm3vq33fJO86+xaOi77Tws/1J3p+HLgWSNnS+TrnXz9
GjlbIl/v5OvXyNkS+Xon3xpa8wks01uS/D+llHfmwdPEpyZ54ex9PRs5WyJf7+Tr18jZEvl6J1+/
Rs6WyNc7+dZQl5fOJkkp5aeS/EqS/3X2pjuTvL/WeuvazaqNkbMl8vVOvn6NnC2Rr3fy9WvkbIl8
vZNv7XRbNAEAAFifutyjWUqZKqW8oZTyhVLKfaWUe2d//4ZSytRaz28SI2dL5Fvr+U1Kvn6NnC2R
b63nNyn5+jVytkS+tZ7fpORbW10WzSR/k+S+JDNJttZatyY5J8m+2ft6NnK2RL7eydevkbMl8vVO
vv+/vbsPtqSu7zz+/gwDkQ2j4zBGHmZ4UAcRLeShHIkaAVF2NlnBDQgkK8mIWVetrEpiZJdNJUZT
OGtcDSYS1yrZkhiGIBoCuyCKCpFEHdwZHpRFIIEBRihhGeRJsiN894/uK5fLBRdO3/vr7/d+XlVT
ntunLL9vu0/f07f79Mmrchu4Lzv3NZTy0llJN0TEPk/3uQwqt4H73Ddulfsqt4H73Ddulfsqt4H7
3DduY+/LekZzs6T3S3r+1AJJu0g6Bbi14VxDqNwG7svOfXlVbgP3Zee+vCq3gfuyc19DWQ80jweW
A5f31yNvBS4DdgaOaznYACq3gfuyc19eldvAfdm5L6/KbeC+7NzXUMpLZ83MzMzMzGy8sp7R/ClJ
B834+eBWswytchu4Lzv35VW5DdyXnfvyqtwG7svOffMv/YEm8M4ZP7+jyRRzo3IbuC879+VVuQ3c
l5378qrcBu7Lzn3zzJfOmpmZmZmZ2aAWtx7gmZK0CFgN7NYv2gJsiAJHzpXbwH3ZuS+vym3gvuzc
l1flNnBfdu5rJ+UZTUlHAmcANwG394tXAKuAd0XEJa1mm1TlNnCf+8atcl/lNnCf+8atcl/lNnCf
+8Zt7H1ZDzSvB9ZExC0zlu8NXBwR+zYZbACV28B97hu3yn2V28B97hu3yn2V28B97hu3sfdlvRnQ
dnSnhWfaQuLLgXuV28B92bkvr8pt4L7s3JdX5TZwX3bua6j5AM/QmcCVktbz2GnilcAJ/XOZVW4D
92Xnvrwqt4H7snNfXpXbwH3Zua+hlJfOAkjaDziax3/w9YKIuK7dVMOo3Abuy859eVVuA/dl5768
KreB+7JzXztpDzTNzMzMzMxsnFJ+RlPSUknrJF0vaauke/rH6yQtbT3fJCq3gftazzcp9+VVuQ3c
13q+Sbkvr8pt4L7W803KfW2lPNAEzgW2AocByyJiGXA4cG//XGaV28B92bkvr8pt4L7s3JdX5TZw
X3buayjlpbOSboiIfZ7ucxlUbgP3uW/cKvdVbgP3uW/cKvdVbgP3uW/cxt6X9YzmZknvl/T8qQWS
dpF0CnBrw7mGULkN3Jed+/Kq3Abuy859eVVuA/dl576Gsh5oHg8sBy7vr0feClwG7Awc13KwAVRu
A/dl5768KreB+7JzX16V28B92bmvoZSXzpqZmZmZmdl4ZT2j+VOSDprx88GtZhla5TZwX3buy6ty
G7gvO/flVbkN3Jed++Zf+gNN4J0zfn5HkynmRuU2cF927surchu4Lzv35VW5DdyXnfvmmS+dNTMz
MzMzs0Etbj3AMyVpEbAa2K1ftAXYEAWOnCu3gfuyc19eldvAfdm5L6/KbeC+7NzXTsozmpKOBM4A
bgJu7xevAFYB74qIS1rNNqnKbeA+941b5b7KbeA+941b5b7KbeA+943b2PuyHmheD6yJiFtmLN8b
uDgi9m0y2AAqt4H73Ddulfsqt4H73Ddulfsqt4H73DduY+/LejOg7ehOC8+0hcSXA/cqt4H7snNf
XpXbwH3ZuS+vym3gvuzc11DzAZ6hM4ErJa3nsdPEK4ET+ucyq9wG7svOfXlVbgP3Zee+vCq3gfuy
c19DKS+dBZC0H3A0j//g6wURcV27qYZRuQ3cl5378qrcBu7Lzn15VW4D92XnvnbSHmiamZmZmZnZ
OKX8jKakpZLWSbpe0lZJ9/SP10la2nq+SVRuA/e1nm9S7surchu4r/V8k3JfXpXbwH2t55uU+9pK
eaAJnAtsBQ4DlkXEMuBw4N7+ucwqt4H7snNfXpXbwH3ZuS+vym3gvuzc11DKS2cl3RAR+zzd5zKo
3Abuc9+4Ve6r3Abuc9+4Ve6r3Abuc9+4jb0v6xnNzZLeL+n5Uwsk7SLpFODWhnMNoXIbuC879+VV
uQ3cl5378qrcBu7Lzn0NZT3QPB5YDlzeX4+8FbgM2Bk4ruVgA6jcBu7Lzn15VW4D92Xnvrwqt4H7
snNfQykvnTUzMzMzM7PxynpG08zMzMzMzEbKB5pmZmZmZmY2KB9ompmZmZmZ2aBSHmhKOkrSs1rP
MVckrZC0rH/8IknHSkp9++X/H5Le0HqGIUh6tqQXzrJ8/xbzDK3y9ll93zKTpNNazzAkSUskvVnS
yZLeI2mNpJS/52ZaCNum119elX8vzKbavnM6SS+QdIykfVvPMgRJe0rasX+8SNJJkv5c0jslLW49
3xAkHSrpxf3j10j6PUm/0nouSHozIEk/Bh4CLgLWA5dExCNtpxqGpPcAJwPbgI8D7wW+AbwaOC0i
zmo43pySdFtErGw9xyQkHQf8KfBDYHvgrRGxoX9uU0Qc2HK+SVXfPovvW/5slsW/AZwFRES8e55H
GlT/2nsfcA3dl1V/ExCwP/BvI+KahuNNrPK2CV5/mS2A3wvV953nR8Sb+sdH072HuYxu/X04Iv57
w/EmJul7wCsi4iFJHwFeAJwPHEG3/k5qOuCEJJ0OvILuPeeX6LouBg4FroqI9zUcL+2B5ibgdcCb
gROAlwFfBNZHxOUtZ5tU/4JYDexI9/03L4yIOyQ9F/hagQOVC5/i6SMi4l/M2zBzQNLVwJp+na2m
+0V0akR8sciBZvXts/K+5XbgcuDLU4uAP6F7c09EfLbRaIOQdC3wyv7NxHLg7Ig4sr+S4FMR8arG
I06k8rYJXn8tZ5vUAvi9UH3f+dP3JpK+Cfx6RNzcvw6/FhGpr8aSdF1E7Nc/3kh30PlI//M1Ffro
9ic7AluA3SPiQUnb0x1ovrTlfGlPGUfEVuDTwKcl7Ur3XTH/RdLuyc+K/d+IeBB4UNJNEXEHdL2S
1Hi2IbwGOBF4YNqyoNtxv7LJRMPabto62yDpcOB/SMq8TU5XffusvG/ZD/gQsAb43Yj4gaQ/zP4m
aYaH+/98EHgeQERcI+k57UYaTuFtc4rXX07Vfy8shH3nlB0i4maAiLhb0qOtBxrA7ZKOiIivAjcD
K4Fb+gPpfGfbnij6f49MewzwKCPoS3ugOV2/UzsdOF3SXm2nmdijkraPiG3AL08t7K8vr7DD/jbw
UERcNvMJSd+f/3EGd5+kF0bEP0K3bfYHm38DNP2r0kCqb5+PU2nfEhH3Ae+RdDDwV5IuIunn9J/E
RcCXJP0d3RvCzwNI2rnpVHOk0rbZ8/rLq/TvhQWw79xf0v3942dJ2rV/7/Jz1Oj8LeAsSR8A7gWu
knQVsBT43ZaDDeSrdJeq7wB8EviKpKlLZ7/ScjDIe+ns4RHx9dZzzAVJewI/6HfY05fvDuwXEc03
Gntykg4AHoyIG2cs3wE4LiI+12ayYfyM7fMlEXFpm8mGUXnfMp26G6y8CzgkIt7Sep6h9Dc/eAlw
9dS+sm/dISIefsr/8sgthG3T6y+n6r8Xpqu675yNpKV07zv/ofUsQ5C0H7AP3Um224ErK3xOur9q
4FDghxFxnaTXAr8I/O+IuKDtdEkPNM2sPfV3GIyIe1rPYjadt02zNvzaszHrr5CIqtvnGF9/KU+J
S9pD0jmSrpB0av+B16nnzm8526Qqt0H9vqfS3+wiNXW3CT9H0l3ABmCDpLv6ZXu1nW5uZV9/1V97
1bfNBbD+Svc9lQL7Fr/2ElsAfdO3z29Tb/sc9esv62c0zwTOo9tg3gZcLumoiLgb2LPpZJOr3AbF
+yQdM8viqZsd7TrP48yFv6a7ff1bIuInAOq+h+pY4BzgkIazTaz4+iv92qP4tkn99Ve6r/i+xa+9
3Kr3Vd8+R92X8tJZSVdHxMun/fwW4FTgjcB5mW+lXbkNFkTfNuBsurt9Pe4p4NiI2Gn+pxqOpBsj
YtXTfS6LyutvAbz2qm+b1ddf9b7K+xa/9hJbAH3Vt89R92U9o7lY0rOmbg4QEZ+TdCdwCfDzbUeb
WOU2qN93LfDRiHjCpVCSjmgwz9A2SjoD+CxwW79sD+A3gU3NphpO5fVX/bVXfdusvv6q91Xet/i1
l1v1vurb56j7sp7R/B1g48yvyJB0IPCRiHhDk8EGULkNFkTfa4HNEbF5ludeERFXNhhrMOpud/42
4Chg937xFuAC4DMR8c+tZhtC5fW3AF571bfN6uuvel/lfYtfe4ktgL7q2+eo+1IeaJqZmZmZmdl4
pbzr7GwkbWw9w1yp3Abuy859eVVuA/dl5768KreB+7Jz3/wpc6BJ94H6qiq3gfuyc19eldvAfdm5
L6/KbeC+7Nw3TyodaF7UeoA59D9bDzDHKq87qL/+qvdV3j4rt0H9Pr/2cqvcV7kN3Jdd9X3naPrS
fwqeucYAAA1oSURBVEZT0nOBRyLivtazmM0k6TnAKuAfI2Jr63mGVr2vqoWy35T0vIi4q/UcZrOp
uH1KWgYQEfe0nsXsyUg6OCL+V+s55sqY+lKe0ZS0u6SzJP0I+D/A9yTdJukDkrZvPd9ckfSE26Jn
I+mkaY9XSPqqpHsl/YOkfVrONgRJfyVpef/4X9Ld0n4dcLWk45oON4AF0Fd2+6y+35T0ryTdLOkK
SQdK+h7wLUlbJL2+9XyTkrSHpHP6vlOnrzNJ57ecbQiVX3tQe/uUtGe/bd4FbAA2SLqrX7ZX2+km
J+nlki7te/aW9HVJP5L0DUkvaj3fpBZA30H9v4On/hP426nlreeb1Nj7Up7RlPR14IPAZcC/AV4L
/D7wn4DnRcTb2003GUnHzLI46K63/m8RsXyeRxqUpE1TX/4r6fPAV4DP0N2W+bcjIvX3iUn6bkS8
rH/8TeDXIuKW/uDsaxGxf9sJJ7MA+spun5X3m9B96ThwArCU7rKhX46Ib0l6CXB2gS8dvxQ4D/g2
3a3sDwKOioi7p2+3WVV+7UHt7VPSt4CPA1+IiJ/0yxYDxwLvjYhDWs43qf533WnATsDHgN8B/hr4
FeA/RMSRDceb2ALoexT4FjD9az4O6ZcREYe3mGsoY+/LeqB5dUS8fNrPGyPioP7x9yPixe2mm4yk
bcDZwKMznwKOjYid5n+q4cx4M3HN9AMTSVdFxAHtpptc/1fqV0XEjyRdARwaEY9MPRcRL2074WQW
QF/Z7bPyfhOesO5ui4iV055Lve5g1vX3FuBU4I3AeZkPVKD2aw9qb5+SboyIVU/3uSxmrLubIuJF
sz2X1QLoOwZ4D7AuIi7ql90cEXu3nWwYY+9b3HqAZ+huSScCXwOOAW4GkLSIEd1p6Rm6FvhoRDzh
MllJqf+i21sh6RN062m5pO0jYlv/XNbtcbo/Ar4u6c+BvwfOlXQhcBjwpZaDDaR6X+Xts/J+E+AB
Sf8eeA5wn6STgXOB1wP3Np1sGIslPSsiHgaIiM9JuhO4BPj5tqMNovJrD2pvnxslnQF8FritX7YH
8JvApmZTDWe7aY8/NuO59B87oHhfRHxB0peBD0l6K/C+1jMNaex9WXfeJwEfBU4BrgZ+u1/+XLrL
wDJ7L/BkN+j41fkcZI78Ho9dCvwdYAlwj6RdgAtaDjaEiDhX0ibg39HdJGd74JXA+oi4pOlwA6je
R+3ts/J+E+CtdJcC3wH8It0bpq8A19NdaprdZ+guh7psakFEXCrpzcBHWg01oMqvPai9ff4GXcMf
Abv3y7bQrbfPtBpqQGdIWhIR90fEGVML+88vXtpwrqFU7yMi7gfe239m8bN0lwmXMea+lJfOmpmZ
mZmZPR2SBCypetf1sfWlPdCUtAZ4E4//69n5EZH+8r3KbbAg+24H/tZ9OVTePiu3gbfN7BZgX6nt
czaS/iAiPth6jkktwG2zel+p196Y+1IeaEo6ne6yvbPoXgwAK4ATgZsi4t2tZptU5TZwn/vGrXJf
5TZwn/vGrXrfk5l546OMqq8797lvLmU90Jz1Lmb96eIbp98xK5vKbeA+941b5b7KbeA+941b5T5J
9z/F0ztGRNb7gQC11x24z31za1HL//EJPCxp9SzLVwM/nu9hBla5DdyXnfvyqtwG7svOfXltBVZF
xJKZ/+hufpRd5XUH7stu1H1Z/8q0FvgLSUvorkOG7jTxff1zma2lbhu4L7u1uC+rtdRtA/dltxb3
ZfWXdF9ncucsz62f51nmwlrqrjtwX3ZrGXFfyktnp0jalWkffI2I2XZyKVVuA/dl5768KreB+7Jz
n41V9XXnvtzG2pf10lkAIuKOiPhORHwHeEfreYZUuQ3cl5378qrcBu7Lzn01SPpA6xmGVn3duS+3
sfalPtCc4ejWA8yhym3gvuzcl1flNnBfdu7Lq3IbuC87982TSgeaaj3AHKrcBu7Lzn15VW4D92Xn
vrwqt4H7snPfPEn9Gc3pJG0XEY+0nmMuSFoUEY+2nmOuuC839+VVuQ1q/14A92VXuW8B7Fvcl5j7
5k/KM5qSPi7pNdOXVdlZS9pZ0h9K+i1JiyT9Z+BCSX8i6bmt55uU+/KT9DpJn5R0gaS/AU6TlPp7
qKaTtEbSpyRdKOlC4JOS1rSeawiV22Yz9XtB0h+0nmUI/fp7m6S94HF9J7WcayjuK+XS1gMMRdLy
GT+fCJwu6e39dxWm5r7cxt6X8oympLuAzcAvAOcA6yNiU9uphiHpYuAa4NnAS4Brgc8DbwD2j4jR
XHf9TLgvfd86YBfgq8CbgJuBG4B3Ah+OiHMbjjcxSacDq4CzgC394hXAicBNEfHuVrNNqnLbzyLp
tohY2XqOSUj6MPBqYCPwRuD0iPhE/9ymiDiw5XyTcl/ePknXAsHjL9fbh+53Q0TE/k0GG8j09SPp
94FfAs6mW4+3RcTJLeeblPvcN6fzJT3Q3BQRB0raBzgBOJ7uO0HPpjvovKHpgBOQdHVEvLz/K8SW
iNht5nMNx5uY+9L3fTciXtY/Xgz8XUS8qj9be0VEvLTthJORdGNErJpluYAbIyLtmdvKbQCS7n+K
p3eMiKzfGw10rz3gwIjYJmkp3fcTfh84GdiY+UAF3Je5T9IFwP3AHwMP0R1wfgN4Dd37zFvaTTe5
GW/kNwG/FBEPSNoe2DT1OzEr97lvLqW8dHZKRNwQER/s39weB+wIXNx4rEktkrQMWAnsJGlv+Omp
8dTrq+e+3B6RtHP/eHf6pojY2m6kQT0safUsy1cDP57vYQZWuQ1gK7AqIpbM/Afc0Xq4AWwXEdsA
IuJeur9WP5vuiokdWg42EPclFRFHAV8APg0c0B9Y/iQiNmc/yOztKOkgSQcD20fEAwD9+qzwsS33
5TbqvtR/4Z0uIq4Grgb+Y+tZJvQx4Ea6N02/Blwq6WZgX+DUloMNxH25nQZslHQj8GK6S2aR9At0
r7/s1gJ/IWkJcHu/bAVwX/9cZmup2wbwl8AewGxfUr1+nmeZC/8k6dCIuBwgIn4CnCTpj4FfbTva
INyXWER8UdKXgQ/1nzlNffA8w53Af+0f3yVpt4j4Qf8H5G0N5xqK+3IbdV/WS2eXRMRTXSaVmqQd
6P4a+Kikqc/6/VNE3NV4tEG4L7f+jOYL6C63vLf1PHNB0q50Z2yhuwS6whkxoHZbZZJ2BIiIJ5x9
lrQiIm5/4n8rD/fl7ptO0gHAIRHxqdazzCVJ2wE/FxEPtZ5lLrgvt7H0pTyjGRH3S1pEd8nX7nQf
Qt8CbIiMR85PtA1YLWkFj7Xd3XakQbkvt3vobirzuu7jfaVeewD0B1+POwCTtG9EXN9opMFUbnsy
FfpmO0CZZqd5G2SOuK+OiLgKuApqvPaeTEQ8ImkPwH0JuW9+ZD2jeSRwBnATj78EbBXwroi4pNVs
k6rcBu5zX14qcOfSJ1O5DdyXnfvyknRrROzReo65UnndgfuyG0NfyjOawCeA18/8kHl/45WL6T4P
l1XlNnCf+0ZM0p89xdNL522QOVC5Ddw3b4PMEffl9TPa0n9/dOV1B+6bt0HmyNj7sh5obsdj3wM3
3RbyNk2p3Abuy65631rgfcA/0132PEXAr7cYaEBrqdsG7stuLe7Lai1128B92a3Ffc1kfWN4JnCl
pPU8dvneSrrv1Dyz2VTDqNwG7suuet93gO9GxN/PfELSB+Z/nEFVbgP3Zee+vCq3gfuyc19DKT+j
CSBpP+BoYLd+0Rbggoi4rt1Uw6jcBu7LrnJf/x2oD7e+S9tcqNwG7svOfXlVbgP3Zee+ttIeaJqZ
mZmZmdk4LWo9wDMhaamkdZKul7RV0j3943WSmn/wdRKV28B9reeblPvyqtwG7ms936Tcl1flNnBf
6/km5b62Uh5oAucCW4HDgGURsQw4HLi3fy6zym3gvuzcl1flNnBfdu7Lq3IbuC879zWU8tJZSTdE
xD5P97kMKreB+9w3bpX7KreB+9w3bpX7KreB+9w3bmPvy3pGc7Ok90t6/tQCSbtIOgW4teFcQ6jc
Bu7Lzn15VW4D92Xnvrwqt4H7snNfQ1kPNI8HlgOX99cjbwUuA3YGjms52AAqt4H7snNfXpXbwH3Z
uS+vym3gvuzc11DKS2fNzMzMzMxsvLKe0UTSvpKOkLTTjOVrWs00lMpt4L7s3JdX5TZwX3buy6ty
G7gvO/c1FBHp/gHvBr4PnA9sBt407blNredzm/vcl/Nf5b7Kbe5z39j/Ve6r3OY+943939j7FpPT
24GDI+IBSXsB50naKyL+tO1Yg6jcBu7Lzn15VW4D92Xnvrwqt4H7snNfQ1kPNBURDwBExC2SDgO+
IGlPQE0nm1zlNnBfdu7Lq3IbuC879+VVuQ3cl537Gsr6Gc0fSjpg6of+/+B/TXeHpf2bTTWMym3g
vuzcl1flNnBfdu7Lq3IbuC879zWU8q6zklYC2yLizhnLBbw6Iq5oM9nkKreB+9w3bpX7KreB+9w3
bpX7KreB+9w3bmPvS3mgaWZmZmZmZuOV9dJZMzMzMzMzGykfaJqZmZmZmdmgfKBpZmZmZmZmg/KB
ppmZmZmZmQ3KB5pmZmZmZmY2qP8HuSpMOI84/3QAAAAASUVORK5CYII=
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[28]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">VGLT</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
VGLT Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2010-06-01 00:00:00
Account Value: 10000
	Buy Price: 52.39
	Num Shares: 190.0
	Remaining Value: 45.9
Sell Date: 
2010-12-27 00:00:00
	Sell Price: 52.25
	Updated Value: 9973.4

-------------------------

Buy Date: 
2011-05-31 00:00:00
Account Value: 9973.4
	Buy Price: 55.12
	Num Shares: 180.0
	Remaining Value: 51.8
Sell Date: 
2013-01-14 00:00:00
	Sell Price: 69.41
	Updated Value: 12545.6

-------------------------

Buy Date: 
2013-04-29 00:00:00
Account Value: 12545.6
	Buy Price: 71.92
	Num Shares: 174.0
	Remaining Value: 31.52
Sell Date: 
2013-05-24 00:00:00
	Sell Price: 68.71
	Updated Value: 11987.06

-------------------------

Buy Date: 
2014-02-14 00:00:00
Account Value: 11987.06
	Buy Price: 64.47
	Num Shares: 185.0
	Remaining Value: 60.11
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 80.53
	Updated Value: 14958.16


===============================

VGLT:
Final Value Basic: 16669.71
Final Value Crossover: 14958.16




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[29]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[29]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/287.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[30]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5oAAAMeCAYAAAB81HtFAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3XuQ52V9L/j3Z5iIF2anZzAZWbkMngQwZ00GjQlqWBsL
4qUMwY0BE0WGMpS5Hk3irlBJKlOmNmqqdLPJ5pSRSEA9XrMxGs0RCJuJUinNcQ+DGCQsCaN4YQBh
EPESL8/+Mc0wzLVnfs+vu5/u16uqq/v5XZ/f7z1ff775Pk93tdYCAAAAvaxa7AkAAACwvCiaAAAA
dKVoAgAA0JWiCQAAQFeKJgAAAF0pmgAAAHR1yKJZVa+qqpuq6jNV9aq5y9ZX1bVVdWtVXVNVM9Of
KgAAACM4aNGsqv8pyS8meXqSH03ywqr6D0kuTXJta+2UJNfNjQEAAOCQZzRPS/LJ1to3W2vfTfIP
SX42yblJrpq7zVVJzpveFAEAABjJoYrmZ5KcObdU9rFJXpDk+CQbWms75m6zI8mGKc4RAACAgaw+
2JWttVuq6o1JrknyYJJtSb67121aVbXpTREAAICRHLRoJklr7YokVyRJVf3vSb6QZEdVPaG1dmdV
HZfkrv3dVwEFAABY3lprtfdlhyyaVfUDrbW7qurEJP9LkjOSnJzkoiRvnPv+1wd50iOe8FK3efPm
XHnllYs9DY6A7MYmv3HJbmzyG5v8xiW7sS33/Kr26ZhJ5lE0k/xlVR2b5NtJfqW1dn9VvSHJ+6rq
FUm2Jzm/10RHsnHjxsWeAkdIdmOT37hkNzb5jU1+45Ld2FZqfvNZOvs/7+eye5OcPZUZAQAAMLRD
/dZZDmJmZmaxp8ARkt3Y5Dcu2Y1NfmOT37hkN7aVmp+iOYFNmzYt9hQ4QrIbm/zGJbuxyW9s8huX
7Ma2UvOraf6ynqpqy/mXAQHQz4F+mQALz2c3APNVVUf2W2cBYKEoOItP4QegB0tnJ7B169bFngJH
SHZjk9+4ZDc2+Y1NfuOS3dhWan6KJgAAAF3ZownAkjC3x2Oxp7HiyQGAw3GgPZrOaALAoD7/+c9n
zZo1iiEAS46iOYGVut56OZDd2OQ3rsPNrqqm/jUfGzduzGMf+9isWbMm69evzwtf+MJ84QtfOIJ3
4NBWrVqVY445JmvWrMnxxx+f3/qt38r3vve9/d72xBNPzAMPPLBgv8DHsTc2+Y1LdmNbqfkpmgAs
cW2KX/NTVfnwhz+cBx54IF/+8pezYcOG/Pqv/3qXV7c/n/70p/PAAw/kuuuuy7ve9a5cfvnl+9zm
O9/5ztSeHwAmpWhOYHZ2drGnwBGS3djkN67lkN3RRx+dn/3Zn83NN9+8+7LZ2dm87W1v2z2+8sor
c+aZZyZJfvVXfzWvec1rHvEY5557bv7oj/7okM916qmn5swzz8w///M/53Of+1xWrVqVK664Iied
dFLOPvvs3Zc9dMbz3nvvzcUXX5wnPvGJWb9+fV70ohftfqwPf/jD2bRpU9atW5dnPetZuemmmw77
tS+H/FYy+Y1LdmNbqfkpmgAwDw/tg/z617+e9773vXnGM56x+7qDLcPdvHlz3v3ud+++/z333JPr
rrsuL33pSw/5XDfffHM+/vGP5/TTT9993cc+9rHccsstufrqq/fZm3nhhRfmm9/8Zm6++ebcdddd
+c3f/M0kyQ033JBXvOIVufzyy3Pvvffmla98Zc4999z8+7//+xG8EwBwaIrmBFbqeuvlQHZjk9+4
Rs2utZbzzjsv69aty8zMTK677rp9zlIeyNOf/vSsXbs21113XZLkPe95T84666x8//d//wHv89Sn
PjXr16/Pueeem0suuSQXX3zx7lK5ZcuWPOYxj8nRRx/9iPt8+ctfzkc/+tG85S1vydq1a7N69erd
Z1Xf+ta35pWvfGWe/vSnp6ry8pe/PEcffXQ+8YlPHNb7MGp+7CK/cclubCs1P0UTAA6hqvLBD34w
9913X771rW/lT/7kT/LsZz87d91117zu//KXvzzvfOc7kyTvfOc7c+GFFx709jfccEPuvffe3Hbb
bXnd6173iOtOOOGE/d7njjvuyPr167N27dp9rvvc5z6XN73pTVm3bt3ury984Qv58pe/PK/5A8Dh
UjQnsFLXWy8Hshub/Ma1HLKrqrzoRS/KUUcdleuvvz5J8rjHPS4PPvjg7tvceeedj7jPy172snzw
gx/MjTfemFtuuSXnnXfeRM+/PyeccELuvffe3H///ftcd+KJJ+a3f/u3c9999+3++trXvpYLLrjg
sJ57OeS3kslvXLIb20rNT9EEgHl4aOlqa2332c0nP/nJSZJNmzblr/7qr/KNb3wjt912W972trc9
ohAef/zx+bEf+7G8/OUvz4tf/OJ9lr32cNxxx+X5z39+fuVXfiU7d+7Mt7/97XzsYx9LklxyySV5
y1vekn/6p39Kay0PPvhgPvKRj+RrX/ta93kAQKJoTmSlrrdeDmQ3NvmNa+Tsfvqnfzpr1qzJ2rVr
87u/+7t5+9vfvrto/sZv/EYe9ahHZcOGDbn44ovzspe9bJ/7X3TRRbnpppsOuWz2YH8Tc3/X7XnZ
O97xjnzf931fTjvttGzYsCF//Md/nCR52tOelssvvzy/9mu/lvXr1+eHfuiH8va3v31er3tPI+eH
/EYmu7Gt1PxWL/YEAODgDly8Fsrtt99+0OuPPfbYXH311Y+47Pd+7/ceMT7ppJNywgkn5NnPfvZB
H+u73/3ufi/fuHHjPtftfdm6dety5ZVX7vf+z33uc/Pc5z73oM8NAL3U3r8aveuDV7VpPj4Ay0dV
7fPnOpaLb3/723nJS16S008/Pb/zO7+z2NM5qOWcAwD9zX1u7PNfhS2dBYAp+uxnP5t169Zlx44d
efWrX73Y0wGABaFoTmClrrdeDmQ3NvmNayVm9+QnPzlf+9rXcv311+eYY45Z7OlMZCXmt5zIb1yy
G9tKzU/RBAAAoCt7NAFYEuwNXBrkAMDhsEcTAACABaFoTmClrrdeDmQ3NvmNS3Zjk9/Y5Dcu2Y1t
peanaAIAANCVPZoALAnLdW/gqlWrctttt+VJT3pSNm/enBNOOCG///u/P/Hjvv71r8+//du/5fLL
L+8wy4ct1xwAmA57NAEYTlVN/Ws+rr/++jzzmc/MzMxMjj322PzkT/5kPvWpTx3x69mfK6+8Mkcd
dVTWrFmTtWvX5vTTT89HPvKRAz7WZZdd1r1kAkAvqxd7AiPbunVrZmdnF3saHAHZjU1+4zqi7LZM
Yybzf+yvfvWreeELX5g/+7M/y/nnn59vfetb+fjHP56jjz76iJ7yYGcLn/WsZ+VjH/tYWmv50z/9
05x//vn50pe+lLVr1z7idt/97ndz1FFHHdHzT8KxNzb5jUt2Y1up+TmjCQAHceutt6aqcsEFF6Sq
8uhHPzrnnHNOnvKUp+y+zRVXXJEf/uEfzvr16/O85z0vn//854/ouR4qoVWViy++ON/4xjdy2223
ZcuWLXnxi1+cCy+8MGvXrs2VV16ZLVu25MILL9x934fOuq5bty4nnnhirrrqqiTJt771rbzmNa/J
SSedlCc84Qn55V/+5Xzzm9+c4B0BgENTNCewEv/LxHIhu7HJb1wjZnfqqafmqKOOyubNm/PRj340
99133yOu/+AHP5jXv/71+cAHPpB77rknZ555Zn7+539+ouf8zne+kz//8z/PmjVrcsoppyRJPvSh
D+Xnfu7ncv/99+elL33pI5bgfu5zn8sLXvCCvOpVr8o999yTbdu2ZdOmTUmSSy+9NLfddltuvPHG
3HbbbfniF7+Y173udUc0rxHz42HyG5fsxrZS81M0AeAg1qxZk+uvvz5VlUsuuSQ/8AM/kJ/5mZ/J
XXfdlSR5y1vekssuuyynnnpqVq1alcsuuyzbtm3LHXfccdjP9YlPfCLr1q3Lcccdl/e+9735wAc+
kDVr1iRJnvnMZ+bcc89Nkjz60Y9+xBLcd73rXTnnnHNywQUX5Kijjsr69evzoz/6o2mt5fLLL8+b
3/zmzMzM5Jhjjslll12W97znPR3eGQA4MEVzAiv1b+IsB7Ibm/zGNWp2p512Wv7iL/4id9xxRz7z
mc/kS1/6Ul796lcn2XU28VWvelXWrVuXdevW5dhjj02SfPGLXzzs5znjjDNy33335e67784//uM/
5jnPec7u644//vgD3u+OO+7Ik570pH0uv/vuu/P1r389T3va03bP7/nPf37uueeew55bMm5+7CK/
cclubCs1P0UTAA7Dqaeemosuuiif+cxnkiQnnnhi3vrWt+a+++7b/fXggw/mjDPO6Pach/oNuSee
eGL+9V//dZ/LH//4x+cxj3lMbr755t1z27lzZ7761a92mxsA7I+iOYGVut56OZDd2OQ3rhGz+5d/
+Ze8+c1v3n2G8o477si73/3uPOMZz0iS/NIv/VL+4A/+IDfffHOS5P7778/73//+/T7Wkf59ykPd
7xd+4Rfyd3/3d3n/+9+f73znO/nKV76SG2+8MatWrcoll1ySV7/61bn77ruT7DrTes011xzRPEbM
j4fJb1yyG9tKzU/RBICDWLNmTT75yU/mJ37iJ3LMMcfkGc94Rn7kR34kb3rTm5Ik5513Xl772tfm
JS95SdauXZunPOUpufrqq3fff88zkQc7M3m41+152Yknnpi//du/zZve9KYce+yxOf300/PpT386
SfLGN74xP/iDP5gzzjgja9euzTnnnJNbb731yN8QAJiHOtL/ujqvB69q03z8xbZS/ybOciC7sclv
XAfLrqr2OXN3sOWivSznz6kjsb8cHuLYG5v8xiW7sS33/OY+N/b5wF69GJMBgPlQAgFgTM5oArAk
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
f3a4bVuO79GvAAAAAElFTkSuQmCC
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[31]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">VIOG</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
VIOG Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2010-12-27 00:00:00
Account Value: 10000
	Buy Price: 60.8
	Num Shares: 164.0
	Remaining Value: 28.8
Sell Date: 
2011-08-18 00:00:00
	Sell Price: 54.17
	Updated Value: 8912.68

-------------------------

Buy Date: 
2012-01-19 00:00:00
Account Value: 8912.68
	Buy Price: 64.67
	Num Shares: 137.0
	Remaining Value: 52.89
Sell Date: 
2012-11-29 00:00:00
	Sell Price: 68.56
	Updated Value: 9445.61

-------------------------

Buy Date: 
2012-12-14 00:00:00
Account Value: 9445.61
	Buy Price: 68.58
	Num Shares: 137.0
	Remaining Value: 50.15
Sell Date: 
2014-08-11 00:00:00
	Sell Price: 98.67
	Updated Value: 13567.94

-------------------------

Buy Date: 
2014-09-04 00:00:00
Account Value: 13567.94
	Buy Price: 100.45
	Num Shares: 135.0
	Remaining Value: 7.19
Sell Date: 
2014-10-01 00:00:00
	Sell Price: 94.52
	Updated Value: 12767.39

-------------------------

Buy Date: 
2014-11-14 00:00:00
Account Value: 12767.39
	Buy Price: 102.36
	Num Shares: 124.0
	Remaining Value: 74.75
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 111.87
	Updated Value: 13946.63


===============================

VIOG:
Final Value Basic: 23045.22
Final Value Crossover: 13946.63




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[32]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[32]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/288.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[33]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6AAAAMeCAYAAAADBWm0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3XuwpGV9L/rvMzMRL8yZCyaIchncUdSUcdBoQGM55khE
yyBWDGAEGbaH8pJ4xMS9hZ3kOGWqvOxTeHKSHcuIIhgjXs7W6FYjEo4TpHLUWNtBDRIyiYOAcpMZ
BLwE9Dl/zGLWrGEYeq3p5+l+ez6fqlVrPd2ru9/+zmuzvr7vr7vUWgMAAACtLZv0BgAAAHBgUEAB
AADoQgEFAACgCwUUAACALhRQAAAAulBAAQAA6GKfBbSUcmEp5eZSyjd2u+z/LKV8q5RyVSnl46WU
Vbtdd14p5V9KKdeUUn6j5YYDAAAwLA92BPT9SU7c47LPJ/mlWutTklyb5LwkKaU8KcmpSZ40d5t3
lVIcYQUAACDJgxTQWusXk2zf47LLaq0/m1t+Ocnhcz+/OMkltdZ7aq3bkmxN8ozxbi4AAABDtb9H
KP9jks/O/fzoJDfsdt0NSR6zn/cPAADAjFhyAS2l/GGSf6+1fmgfv1aXev8AAADMlhVLuVEpZWOS
Fyb5X3e7+MYkR+y2Pnzusj1vq5QCAADMsFpr2dvliz4CWko5Mcl/SvLiWuuPd7vqU0lOK6U8pJRy
dJLHJfnKA2zMoL7OPPPMiW/DrH/JWM6z8iVjGc/Cl4zlPCtfMpbxrHwNLed92ecR0FLKJUmek+SR
pZTrk7w5O9/19iFJLiulJMn/V2t9ba316lLKR5NcneTeJK+tD/boA7Fu3bpJb8LMk3Efcm5Pxu3J
uD0Z9yHn9mTcnoz7mKWc91lAa60v28vFF+7j99+a5K37u1EAAADMHp/TOYLVq1dPehNmnoz7kHN7
Mm5Pxu3JuA85tyfj9mTcxyzlrICOYP369ZPehJkn4z7k3J6M25NxezLuQ87tybg9GfcxSzmX3mOa
pZS9jobOzZMyJWZkfBcAAOislJL6AO+Cu6SPYWlF6ZkO/s8AAACgBafgMhU2b9486U04IMi5PRm3
J+P2ZNyHnNuTcXsy7mOWclZAAQAA6GKqZkCdgjsd/FsAAABLta8ZUEdAB+473/lOVq5cqTACAABT
b6oLaCml+deo1q1bl4c//OFZuXJl1q5dmxe96EW54YYbmjzvZcuW5eCDD87KlStz+OGH5w/+4A/y
s5/9bK+/e+SRR+bOO+8c/BsHzdJ57dNMzu3JuD0ZtyfjPuTcnozbk3Efs5TzVBfQnWrDr9GVUvLp
T386d955Z773ve/l0EMPzete97r9fnYP5Otf/3ruvPPOXH755fnQhz6UCy644H6/c++99zZ7fAAA
gHEbQAGdPgcddFB+67d+K1dfffWuyzZs2JD3ve99u9YXXXRRnv3sZydJfvd3fzdvfOMbF9zHSSed
lD/90z990Mc65phj8uxnPzv/9E//lOuuuy7Lli3LhRdemKOOOirPe97zdl123xHS22+/PWeddVYe
85jHZO3atXnJS16y674+/elPZ/369VmzZk2e9axn5Rvf+MZ+5TBOGzZsmPQmHBDk3J6M25NxezLu
Q87tybg9GfcxSzkroItw35zlD3/4w3zkIx/J8ccfv+u6fZ3Su3HjxlxyySW7bn/bbbfl8ssvz8tf
/vIHfayrr746X/ziF3Psscfuuu6KK67INddck0svvfR+s59nnHFGfvzjH+fqq6/OLbfckt///d9P
knzta1/LK1/5ylxwwQW5/fbb86pXvSonnXRS/v3f/30JSQAAACyeAjqiWmtOPvnkrFmzJqtXr87l
l19+v6OaD+TpT396Vq1alcsvvzxJ8uEPfzjPfe5z8/M///MPeJunPvWpWbt2bU466aScffbZOeus
s3aVzU2bNuVhD3tYDjrooAW3+d73vpfPfe5zefe7351Vq1ZlxYoVu47Cvuc978mrXvWqPP3pT08p
Ja94xSty0EEH5Utf+tJS4hi7WTqvfZrJuT0Ztyfj9mTch5zbk3F7Mu5jlnJWQEdUSsknP/nJbN++
PT/5yU/y53/+53nOc56TW265ZaTbv+IVr8gHP/jBJMkHP/jBnHHGGfv8/a997Wu5/fbbs3Xr1rzl
LW9ZcN0RRxyx19tcf/31Wbt2bVatWnW/66677rqcf/75WbNmza6vG264Id/73vdG2n4AAID9pYAu
QSklL3nJS7J8+fJceeWVSZJHPOIRufvuu3f9zk033bTgNqeffno++clP5qqrrso111yTk08+eb8e
f2+OOOKI3H777bnjjjvud92RRx6ZP/zDP8z27dt3fd1111059dRTl7wd4zRL57VPMzm3J+P2ZNye
jPuQc3sybk/GfcxSzgroItx3CmytddfR0Cc+8YlJkvXr1+fjH/94fvSjH2Xr1q153/vet6AoHn74
4fmVX/mVvOIVr8hLX/rS+50+Ow6HHXZYXvCCF+S1r31tduzYkXvuuSdXXHFFkuTss8/Ou9/97nzl
K19JrTV33313PvOZz+Suu+4a+3YAAADsjQK6CL/5m7+ZlStXZtWqVfnjP/7jfOADH9hVQN/whjfk
IQ95SA499NCcddZZOf300+93+zPPPDPf+MY3HvT02319pufertv9sr/6q7/Kz/3cz+UJT3hCDj30
0PzZn/1ZkuRpT3taLrjggvze7/1e1q5dm8c97nH5wAc+MNLz7mGWzmufZnJuT8btybg9Gfch5/Zk
3J6M+5ilnFdMegMe3AOXsZ6+/e1v7/P6Qw45JJdeeumCy9785jcvWB911FE54ogj8pznPGef9/XT
n/50r5evW7fuftftedmaNWty0UUX7fX2z3/+8/P85z9/n48NAADQStnzYzyaP2ApdW+PWUq530eK
zJJ77rknp512Wo499tj80R/90aQ3Z59m/d8CAABoZ65P7PVIolNwO/jWt76VNWvW5Oabb84555wz
6c0BAACYCAW0gyc+8Ym56667cuWVV+bggw+e9OZMpVk6r32aybk9Gbcn4/Zk3Iec25NxezLuY5Zy
VkABAADowgwo9+PfAgAAWCozoAAAAEycAspUmKXz2qeZnNuTcXsybk/Gfci5PRm3J+M+ZilnBRQA
AIAuzIB2sGzZsmzdujWPfexjs3HjxhxxxBH5kz/5k/2+37e97W35t3/7t1xwwQVj2Mp5s/xvAQAA
tDXYGdBSSvOvUV155ZV55jOfmdWrV+eQQw7Jr/3ar+WrX/3qkp/T3lx00UVZvnx5Vq5cmVWrVuXY
Y4/NZz7zmQe8r/POO2/s5RMAAKCVFZPegAe1afL3/YMf/CAvetGL8pd/+Zc55ZRT8pOf/CRf/OIX
c9BBBy3pYfd1dPFZz3pWrrjiitRa8xd/8Rc55ZRT8t3vfjerVq1a8Hs//elPs3z58iU9/jTavHlz
NmzYMOnNmHlybk/G7cm4PRn3Ief2ZNyejPuYpZyn+gjotLj22mtTSsmpp56aUkoe+tCH5oQTTsiT
n/zkXb9z4YUX5klPelLWrl2bE088Md/5zneW9Fj3ldNSSs4666z86Ec/ytatW7Np06a89KUvzRln
nJFVq1bloosuyqZNm3LGGWfsuu19R2nXrFmTI488MhdffHGS5Cc/+Une+MY35qijjsqjHvWovOY1
r8mPf/zj/UgEAABg8RTQERxzzDFZvnx5Nm7cmM997nPZvn37gus/+clP5m1ve1s+8YlP5Lbbbsuz
n/3svOxlL9uvx7z33nvz3ve+NytXrszjH//4JMmnPvWp/PZv/3buuOOOvPzlL19wKu91112XF77w
hXn961+f2267LVu2bMn69euTJOeee262bt2aq666Klu3bs2NN96Yt7zlLfu1feM2K/+PzrSTc3sy
bk/G7cm4Dzm3J+P2ZNzHLOWsgI5g5cqVufLKK1NKydlnn51f+IVfyItf/OLccsstSZJ3v/vdOe+8
83LMMcdk2bJlOe+887Jly5Zcf/31i36sL33pS1mzZk0OO+ywfOQjH8knPvGJrFy5MknyzGc+Myed
dFKS5KEPfeiCU3k/9KEP5YQTTsipp56a5cuXZ+3atXnKU56SWmsuuOCCvPOd78zq1atz8MEH57zz
zsuHP/zhMSQDAAAwOgV0RE94whPy/ve/P9dff32++c1v5rvf/W7OOeecJDuPPr7+9a/PmjVrsmbN
mhxyyCFJkhtvvHHRj3Pcccdl+/btufXWW/MP//AP+fVf//Vd1x1++OEPeLvrr78+j33sY+93+a23
3pof/vCHedrTnrZr+17wghfktttuW/S2tTRLn200zeTcnozbk3F7Mu5Dzu3JuD0Z9zFLOSugS3DM
McfkzDPPzDe/+c0kyZFHHpn3vOc92b59+66vu+++O8cdd9zYHvPB3rX3yCOPzL/+67/e7/JHPvKR
edjDHparr75617bt2LEjP/jBD8a2bQAAAKNQQEfwz//8z3nnO9+564jm9ddfn0suuSTHH398kuTV
r3513vrWt+bqq69Oktxxxx352Mc+ttf7Wurnaz7Y7X7nd34nf/d3f5ePfexjuffee/P9738/V111
VZYtW5azzz4755xzTm699dYkO4/Mfv7zn1/SdrQyS+e1TzM5tyfj9mTcnoz7kHN7Mm5Pxn3MUs4K
6AhWrlyZL3/5y/nVX/3VHHzwwTn++OPzy7/8yzn//POTJCeffHLe9KY35bTTTsuqVavy5Cc/OZde
eumu2+9+5HJfRzIXe93ulx155JH57Gc/m/PPPz+HHHJIjj322Hz9619PkrzjHe/IL/7iL+a4447L
qlWrcsIJJ+Taa69deiAAAABLUJZ6RG7JD1hK3dtjllLud5RvX6ecjkvv5z8Ee/u3aG2WPttomsm5
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
RfwfULFnnCSi9QAAAAAASUVORK5CYII=
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[34]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">VO</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
VO Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2004-04-12 00:00:00
Account Value: 10000
	Buy Price: 43.85
	Num Shares: 228.0
	Remaining Value: 2.2
Sell Date: 
2004-05-10 00:00:00
	Sell Price: 40.39
	Updated Value: 9211.12

-------------------------

Buy Date: 
2004-06-24 00:00:00
Account Value: 9211.12
	Buy Price: 43.79
	Num Shares: 210.0
	Remaining Value: 15.22
Sell Date: 
2004-07-26 00:00:00
	Sell Price: 41.02
	Updated Value: 8629.42

-------------------------

Buy Date: 
2004-09-29 00:00:00
Account Value: 8629.42
	Buy Price: 43.21
	Num Shares: 199.0
	Remaining Value: 30.63
Sell Date: 
2006-08-01 00:00:00
	Sell Price: 57.81
	Updated Value: 11534.82

-------------------------

Buy Date: 
2006-09-22 00:00:00
Account Value: 11534.82
	Buy Price: 59.41
	Num Shares: 194.0
	Remaining Value: 9.28
Sell Date: 
2007-08-30 00:00:00
	Sell Price: 68.32
	Updated Value: 13263.36

-------------------------

Buy Date: 
2007-09-17 00:00:00
Account Value: 13263.36
	Buy Price: 68.56
	Num Shares: 193.0
	Remaining Value: 31.28
Sell Date: 
2007-11-21 00:00:00
	Sell Price: 65.6
	Updated Value: 12692.08

-------------------------

Buy Date: 
2008-05-28 00:00:00
Account Value: 12692.08
	Buy Price: 68.17
	Num Shares: 186.0
	Remaining Value: 12.46
Sell Date: 
2008-06-26 00:00:00
	Sell Price: 63.47
	Updated Value: 11817.88

-------------------------

Buy Date: 
2009-06-10 00:00:00
Account Value: 11817.88
	Buy Price: 44.93
	Num Shares: 263.0
	Remaining Value: 1.29
Sell Date: 
2010-07-22 00:00:00
	Sell Price: 58.37
	Updated Value: 15352.6

-------------------------

Buy Date: 
2010-07-29 00:00:00
Account Value: 15352.6
	Buy Price: 58.66
	Num Shares: 261.0
	Remaining Value: 42.34
Sell Date: 
2010-09-03 00:00:00
	Sell Price: 59.79
	Updated Value: 15647.53

-------------------------

Buy Date: 
2010-09-21 00:00:00
Account Value: 15647.53
	Buy Price: 61.42
	Num Shares: 254.0
	Remaining Value: 46.85
Sell Date: 
2011-08-15 00:00:00
	Sell Price: 67.77
	Updated Value: 17260.43

-------------------------

Buy Date: 
2012-01-31 00:00:00
Account Value: 17260.43
	Buy Price: 73.81
	Num Shares: 233.0
	Remaining Value: 62.7
Sell Date: 
2015-04-08 00:00:00
	Sell Price: 130.08
	Updated Value: 30371.34


===============================

VO:
Final Value Basic: 30568.8
Final Value Crossover: 30371.34




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[35]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[35]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/289.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[36]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6AAAAMeCAYAAAADBWm0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3XuQpXV97/vPbyCibmbPhUTkhMvAjqKmSAaNiZdQDB6J
lzJIEqMmBhm2RWluB5O4T8CTHLtMVdSc0pMTq1KUeAFjRGMlxlsiGsrZamWrJ2c7iiGGTMIoGB1E
GMRrQJ/zRzfDMAwz3T3dv/V8n369qrpmntW9er17zfDAl/V8u9swDAEAAIDVtm7WAQAAAKwNBlAA
AAC6MIACAADQhQEUAACALgygAAAAdGEABQAAoItDDqCttTe31va01q47yPt+p7X2/dba5v1uu6y1
9i+ttc+31n5mNYIBAACo6XCvgL4lydMPvLG1dlKSc5N8Yb/bHpPkeUkes3CfP22teYUVAACAJIcZ
QIdh+FiS2w/yrtcl+d8PuO3ZSa4ehuGuYRh2J9mV5CdXIhIAAID6lvwKZWvt2UluHobhswe8639J
cvN+xzcn+eEjaAMAAGBCjl7KB7fWHprk5Zm//HbfzYe4y7CcKAAAAKZnSQNokv+SZEuSz7TWkuTE
JP9fa+2nknwpyUn7feyJC7fdR2vNUAoAADBhwzAc9IXKJV2COwzDdcMwHD8Mw6nDMJya+ctsHzsM
w54k703y/Nbag1prpyZ5RJJPPcDnWZW3Cy+8cNU+t17NejXr1Ty2t2q9FZur9WrWq1nvGJoP5XA/
huXqJH+f5JGttZtaaxcdOEvuN1Ren+Qvklyf5G+T/NpwuEdfYVu2bOn5cEesWm+iuYdqvYnmHqr1
Jpp7qNab1Guu1pto7qFab6K5h2q9yWyaD3kJ7jAMv3SY9592wPEfJvnDFegCAABgYib1czo3btw4
64QlqdabaO6hWm+iuYdqvYnmHqr1JvWaq/Ummnuo1pto7qFabzKb5kkNoFu3bp11wpJU600091Ct
N9HcQ7XeRHMP1XqTes3VehPNPVTrTTT3UK03mU1z67ymmdbaQVdDF76rLiPR++8FAAAwDa21DA/w
XXCX+mNYVpWhZxz8zwAAAGA1TOoSXFbfjh07Zp2wZNWaq/Ummnuo1pto7qFab1KvuVpvormHar2J
5h6q9SazaTaAAgAA0MWodkBdgjsO/iwAAIDlOtQOqFdAi/viF7+Y9evXGxgBAIDRG/UA2lpb9bfF
2rJlSx760Idm/fr12bx5c571rGfl5ptvXpWve926dTn22GOzfv36nHjiifmd3/mdfP/73z/ox558
8sm58847u33jINe2r75qvYnmHqr1Jpp7qNab1Guu1pto7qFab6K5h2q9iR3QBzCs4tvitdby/ve/
P3feeWe+/OUv5/jjj89v/uZvHvFX90A++9nP5s4778y1116bt7/97bniiivu9zF33333qj0+AADA
SiswgI7PMccck1/4hV/I9ddfv++2bdu25U1vetO+4yuvvDJnnXVWkuTXf/3X87KXvew+n+O8887L
H//xHx/2sU4//fScddZZ+cd//Md84QtfyLp16/LmN785p5xySp761Kfuu+2eV0hvu+22XHTRRfnh
H/7hbN68OT/3cz+373O9//3vz9atW7Np06Y8+clPznXXXbfkr33btm1Lvs+sVWuu1pto7qFab6K5
h2q9Sb3mar2J5h6q9Saae6jWm8ym2QC6BPfsWX7rW9/KO9/5zjzxiU/c975DXdK7ffv2XH311fvu
f+utt+baa6/NC17wgsM+1vXXX5+PfexjOfPMM/e976Mf/Wg+//nP55prrrnf7ucFF1yQ73znO7n+
+utzyy235Ld/+7eTJJ/+9Kfzohe9KFdccUVuu+22vPjFL855552X//iP/1jGMwEAALB0BtBFGoYh
559/fjZt2pSNGzfm2muvvd+rmg/k8Y9/fDZs2JBrr702SfKOd7wj55xzTn7oh37oAe/z2Mc+Nps3
b855552Xiy++OBdddNG+YXNubi4PechDcswxx9znPl/+8pfzwQ9+MJdffnk2bNiQo48+et+rsG94
wxvy4he/OI9//OPTWssLX/jCHHPMMfnEJz6xpOfBte2rr1pvormHar2J5h6q9Sb1mqv1Jpp7qNab
aO6hWm9iB3TUWmt5z3vek9tvvz3f/e538/rXvz5nn312brnllkXd/4UvfGHe9ra3JUne9ra35YIL
Ljjkx3/605/Obbfdll27duWVr3zlfd530kknHfQ+N910UzZv3pwNGzbc731f+MIX8trXvjabNm3a
93bzzTfny1/+8qL6AQAAjtSofw7o/CWtq9m3+J93eeqpp+ZNb3pTnvKUp+y77WEPe1guv/zy/PzP
/3ye9axn5WlPe9q+b0z06le/Oh/4wAfysY99LEly880354wzzsiOHTty9tlnZ8+ePfd7BfMe69at
y65du3Laaafd5/bdu3fntNNOy913351169bd77Y9e/bkxBNPzG233Xa/IfQlL3lJTj755Lz85S8/
/LPi54ACAADL5OeArpB7hrJhGPa9GvroRz86SbJ169b81V/9Vb797W9n165dedOb3nSfndATTzwx
P/ETP5EXvvCFec5znvOAw+eROOGEE/KMZzwjv/Zrv5a9e/fmrrvuykc/+tEkycUXX5zLL788n/rU
pzIMQ775zW/mAx/4QL7xjW+seAcAAMDBGECX4Gd/9mezfv36bNiwIb//+7+ft771rfsG0N/6rd/K
gx70oBx//PG56KKL8iu/8iv3u/+FF16Y66677rCX3x7qZ3oe7H373/Znf/Zn+YEf+IE86lGPyvHH
H58/+ZM/SZI87nGPyxVXXJHf+I3fyObNm/OIRzwib33rWxf1de/Pte2rr1pvormHar2J5h6q9Sb1
mqv1Jpp7qNabaO6hWm8ym+ajuz/ikj3wMNbTjTfeeMj3H3fccbnmmmvuc9srXvGK+xyfcsopOemk
k3L22Wcf8nN973vfO+jtW7Zsud/7Drxt06ZNufLKKw96/6c97Wl52tOedsjHBgAAWC2j3gGdkrvu
uivPf/7zc+aZZ+b3fu/3Zp1zSFP/swAAAFaPHdAZ+6d/+qds2rQpe/bsyUtf+tJZ5wAAAMyEAbSD
Rz/60fnGN76Rj3/84zn22GNnnXNEXNu++qr1Jpp7qNabaO6hWm9Sr7lab6K5h2q9ieYeqvUmfg4o
AAAAE2YHlPvxZwEAACyXHVAAAABmzgDKkri2ffVV600091CtN9HcQ7XepF5ztd5Ecw/VehPNPVTr
TeyAAgAAMGF2QDtYt25ddu3aldNOOy3bt2/PSSedlD/4gz844s/7qle9Kv/2b/+WK664YgUq7zXl
PwsAAGB1ld0Bba2t+ttiffzjH8+TnvSkbNy4Mccdd1x++qd/Ov/wD/+w7K/pYK688socddRRWb9+
fTZs2JAzzzwzH/jABx7wc1122WUrPnwCAACsllEPoEmSuVV8W6Svf/3redaznpVLLrkkt99+e770
pS/lFa94RY455pglfSn3ONSri09+8pNz5513Zu/evXnRi16U5z73ubnjjjvu93Hf+973lvXYR8q1
7auvWm+iuYdqvYnmHqr1JvWaq/Ummnuo1pto7qFab2IHdLRuuOGGtNbyvOc9L621PPjBD865556b
M844Y9/HvPnNb85jHvOYbN68OU9/+tPzxS9+cVmPdc9w2lrLRRddlG9/+9vZtWtX5ubm8pznPCcX
XHBBNmzYkCuvvDJzc3O54IIL9t33nldpN23alJNPPjlXXXVVkuS73/1uXvayl+WUU07Jwx/+8Pzq
r/5qvvOd7xzBMwIAALB0BtBFOP3003PUUUdl+/bt+eAHP5jbb7/9Pu9/z3vek1e96lV597vfnVtv
vTVnnXVWfumXfumIHvPuu+/OG9/4xqxfvz6PfOQjkyTvfe9784u/+Iu544478oIXvOA+l/J+4Qtf
yDOf+cxccsklufXWW7Nz585s3bo1SXLppZdm165d+cxnPpNdu3blS1/6Ul75ylcuq2vbtm1H9HXN
QrXmar2J5h6q9Saae6jWm9RrrtabaO6hWm+iuYdqvclsmg2gi7B+/fp8/OMfT2stF198cR72sIfl
2c9+dm655ZYkyeWXX57LLrssp59+etatW5fLLrssO3fuzE033bTkx/rEJz6RTZs25YQTTsg73/nO
vPvd78769euTJE960pNy3nnnJUke/OAH3+dS3re//e0599xz87znPS9HHXVUNm/enB//8R/PMAy5
4oor8rrXvS4bN27Msccem8suuyzveMc7VuCZAQAAWDwD6CI96lGPylve8pbcdNNN+dznPpd///d/
z0tf+tIk868+XnLJJdm0aVM2bdqU4447LknypS99acmP84QnPCG33357vvrVr+bv//7v85SnPGXf
+0488cQHvN9NN92U00477X63f/WrX823vvWtPO5xj9vX94xnPCO33nrrktsS17b3UK030dxDtd5E
cw/VepN6zdV6E809VOtNNPdQrTexA1rG6aefngsvvDCf+9znkiQnn3xy3vCGN+T222/f9/bNb34z
T3jCE1bsMQ/3XXtPPvnk/Ou//uv9bv/BH/zBPOQhD8n111+/r23v3r35+te/vmJtAAAAi2EAXYR/
/ud/zute97p9r2jedNNNufrqq/PEJz4xSfKSl7wkf/iHf5jrr78+SXLHHXfkXe9610E/13J/vubh
7vfLv/zL+bu/+7u8613vyt13352vfe1r+cxnPpN169bl4osvzktf+tJ89atfTTL/yuyHPvShZXW4
tn31VetNNPdQrTfR3EO13qRec7XeRHMP1XoTzT1U603sgI7W+vXr88lPfjI/9VM/lWOPPTZPfOIT
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
+wPPfe/9ur0ea53V9+wdniebffbnfL77xzciWmQCGhERERERES0yAY2IiIiIiIgWmYBGRERERERE
i0xAIyIiIiIiokUmoBEREREREdEiE9CIiIiIiIhokQloREREREREtMgENCIiIiIiIlpkAhoRERER
EREtMgGNiIiIiIiIFpmARkRERERERItMQCMiIiIiIqJFJqARERERERHRIhPQiIiIiIiIaJEJaERE
RERERLTIBDQiIiIiIiJaZAIaERERERERLTIBjYiIiIiIiBaZgEZERERERESLTEAjIiIiIiKiRSag
ERERERER0SIT0IiIiIiIiGiRCWhERERERES0yAQ0IiIiIiIiWmQCGhERERERES0yAY2IiIiIiIgW
mYBGREREREREi0xAIyIiIiIiokUmoBEREREREdFixSegko6TtF7SDZJes9L/+xEREREREeFpRSeg
klYBfwocBxwCvEDSwSv5MyIiIiIiIsLTSp8BPRK4saq+XFX3AO8Bjl/hnxERERERERGGVnoCuj9w
y6Lvb50ti4iIiIiIiH/lVFUr9z8mPQ84rqp+Y/b9i4AnV9V/WvT/s3I/MCIiIiIiIianqrTc8p1X
+OdsANYs+n4Nw1nQLYZERERERETEjm2lL8G9DFgr6QBJuwInAuet8M+IiIiIiIgIQyt6BrSqvifp
ZcAFwCrgz6vqiyv5MyIiIiIiIsLTit4DGhERERERETHPSt8D2kbSTgwf+7I/UAz3n15aE51Ru/VC
mju49UKaO7j1Qpo7uPWCX7NbL6S5g1svpLmDWy9Mp9nyDKikY4EzgBu57yFHq4G1wClVdcFYbctx
64U0d3DrhTR3cOuFNHdw6wW/ZrdeSHMHt15Icwe3XphYc1XZfQHrgQOWWX4gsH7sPvfeNKc3zelN
8/iNzr2OzW69aU5vmtPr2rzST8HtsorhlPFSG5jmZcVuvZDmDm69kOYObr2Q5g5uveDX7NYLae7g
1gtp7uDWCxNqnuoG2pIzgc9KOof7TiGvAU6arZsat15Icwe3XkhzB7deSHMHt17wa3brhTR3cOuF
NHdw64UJNVveAwog6RDgeGC/2aINwHlVde14VfO59UKaO7j1Qpo7uPVCmju49YJfs1svpLmDWy+k
uYNbL0yn2XYCGhEREREREV4s7wGVtKek0yStl7RR0p2z16dJ2nPsvqXceiHNHdx6Ic0d3HohzR3c
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
1Um1YZx0vQAAAABJRU5ErkJggg==
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[37]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">curTicker</span> <span class="o">=</span> <span class="n">VWO</span>

<span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="mi">20</span><span class="p">,</span><span class="mi">200</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
VWO Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2005-08-02 00:00:00
Account Value: 10000
	Buy Price: 21.34
	Num Shares: 468.0
	Remaining Value: 12.88
Sell Date: 
2006-06-28 00:00:00
	Sell Price: 24.37
	Updated Value: 11418.04

-------------------------

Buy Date: 
2006-07-18 00:00:00
Account Value: 11418.04
	Buy Price: 24.52
	Num Shares: 465.0
	Remaining Value: 16.24
Sell Date: 
2008-02-12 00:00:00
	Sell Price: 39.11
	Updated Value: 18202.39

-------------------------

Buy Date: 
2008-02-28 00:00:00
Account Value: 18202.39
	Buy Price: 41.89
	Num Shares: 434.0
	Remaining Value: 22.13
Sell Date: 
2008-03-04 00:00:00
	Sell Price: 40.05
	Updated Value: 17403.83

-------------------------

Buy Date: 
2008-03-05 00:00:00
Account Value: 17403.83
	Buy Price: 40.81
	Num Shares: 426.0
	Remaining Value: 18.77
Sell Date: 
2008-03-20 00:00:00
	Sell Price: 37.39
	Updated Value: 15946.91

-------------------------

Buy Date: 
2008-04-28 00:00:00
Account Value: 15946.91
	Buy Price: 42.41
	Num Shares: 376.0
	Remaining Value: 0.749999999995
Sell Date: 
2008-06-19 00:00:00
	Sell Price: 40.25
	Updated Value: 15134.75

-------------------------

Buy Date: 
2009-05-15 00:00:00
Account Value: 15134.75
	Buy Price: 25.53
	Num Shares: 592.0
	Remaining Value: 20.99
Sell Date: 
2010-06-01 00:00:00
	Sell Price: 33.25
	Updated Value: 19704.99

-------------------------

Buy Date: 
2010-07-30 00:00:00
Account Value: 19704.99
	Buy Price: 37.1
	Num Shares: 531.0
	Remaining Value: 4.88999999999
Sell Date: 
2011-08-09 00:00:00
	Sell Price: 38.11
	Updated Value: 20241.3

-------------------------

Buy Date: 
2012-02-16 00:00:00
Account Value: 20241.3
	Buy Price: 40.77
	Num Shares: 496.0
	Remaining Value: 19.38
Sell Date: 
2012-05-29 00:00:00
	Sell Price: 35.64
	Updated Value: 17696.82

-------------------------

Buy Date: 
2012-08-23 00:00:00
Account Value: 17696.82
	Buy Price: 37.78
	Num Shares: 468.0
	Remaining Value: 15.78
Sell Date: 
2012-09-12 00:00:00
	Sell Price: 38.44
	Updated Value: 18005.7

-------------------------

Buy Date: 
2012-09-20 00:00:00
Account Value: 18005.7
	Buy Price: 39.31
	Num Shares: 458.0
	Remaining Value: 1.71999999999
Sell Date: 
2013-06-17 00:00:00
	Sell Price: 37.89
	Updated Value: 17355.34

-------------------------

Buy Date: 
2013-10-24 00:00:00
Account Value: 17355.34
	Buy Price: 40.47
	Num Shares: 428.0
	Remaining Value: 34.18
Sell Date: 
2014-01-07 00:00:00
	Sell Price: 38.31
	Updated Value: 16430.86

-------------------------

Buy Date: 
2014-04-10 00:00:00
Account Value: 16430.86
	Buy Price: 40.27
	Num Shares: 408.0
	Remaining Value: 0.699999999986
Sell Date: 
2014-12-15 00:00:00
	Sell Price: 37.83
	Updated Value: 15435.34


===============================

VWO:
Final Value Basic: 21924.98
Final Value Crossover: 15435.34




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[38]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">plot_data</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[38]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/290.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[39]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">plot_buy_and_sell</span><span class="p">(</span><span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">curTicker</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>


<div class="output_png output_subarea ">
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5oAAAMeCAYAAAB81HtFAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAIABJREFUeJzs3XuMZVdhLvhvtZ0AGffttk0wVmzTbSW8Rk7aISQ8wriM
goCIOCRDeAQMjSwL8uAaAlfBEREFkQJkrn1HyUixMCY2MDwuc8MlPC6G+NICFEGUkZtHnMA4cYNN
TBuwG8wzGNb80XXK7e6qrt3dq6rWqvr9pKOqfeqcs79eZ5/l+nz2OlVqrQEAAIBWtqx3AAAAADYW
RRMAAICmFE0AAACaUjQBAABoStEEAACgKUUTAACApiYVzVLKSaWUG0sp71vYni+l3LZw3Y2llKes
bkwAAABGcfLE212W5KYkWxe2a5Ira61XrkoqAAAAhrXiO5qllLOS/GqSNyUps6sP+R4AAAAWTTl1
9r8k+U9JfnTIdTXJS0opny6lXFNK2b4q6QAAABjOUYtmKeVpSe6otd6Y+76D+ZdJdibZleT2JFes
WkIAAACGUmqty/+wlD9NcnGSe5LcP8l/SPLfaq3PP+Q2O5K8r9Z63hL3X/7BAQAAGF6t9YhllUd9
R7PW+ke11rNrrTuTPDvJ/6y1Pr+UcuYhN/uNJJ89ymOc8OUFL3hBk8dpfekxl0wybYZcMsm0GXLJ
JNNmyCWTTJsh10bPtJypnzqbHDx1dvZIf1ZK+bmF7VuSvOgYHueY7dixYzUf/rj1mEumaWSarsdc
Mk0j03Q95pJpGpmm6zGXTNPINF2PuTZrpslFs9a6J8mehe8vXqU8AAAADG7Kp86uu+3b+/xQ2x5z
yTSNTNP1mEumaWSarsdcMk0j03Q95pJpGpmm6zHXZs00RNHctWvXekdYUo+5ZJpGpul6zCXTNDJN
12MumaaRaboec8k0jUzT9Zhrs2Y66qfOnvCDl1JX8/EBAICNq5QjPsyUdbRUtyulpC7xqbPH8mFA
AAAAa8obV3041tI/xKmze/bsWe8IS+oxl0zTyDRdj7lkmkam6XrMJdM0Mk3XYy6ZppGJEQ1RNAEA
ABiHNZoAAECXFtb/rXcMsvxzsdwaTe9oAgAAbBBf+tKXsnXr1nUv6EMUzV7PAe8xl0zTyDRdj7lk
mkam6XrMJdM0Mk3XYy6ZppHpvkopq36ZYseOHfmJn/iJbN26Naeddlqe9rSn5bbbbluVf/OWLVty
yimnZOvWrTnrrLPy8pe/PD/60Y+WvO0555yTu+++e90/sXeIogkAAHCvuoqXaUopef/735+77747
t99+e84444y85CUvafKvW8pnPvOZ3H333bnhhhvy9re/PVdfffURt7nnnntWbf/HyhpNAACgS0ut
Czz4Tt1qdoxp60J37tyZa665Jk984hOTJB/84Afzspe9LJ///OeTJHNzc7n44otzySWXJEmuvfba
XHPNNfn4xz+e3/u938sDHvCA/Of//J8XH++iiy7KE5/4xLz0pS89Yl9btmzJzTffnHPPPTdJ8sxn
PjMPfvCD8/KXvzw7d+7Mm970przmNa/Jzp07c91112Xnzp255557smXLltx55515+ctfng9/+MP5
7ne/mwsuuCDvec97kiTvf//786pXvSpf/OIX88hHPjJXXXVVzjvvvKVHxRpNAACA1TcrXt/5znfy
rne9K4997GMXf3a003B3796dd7zjHYv3/9rXvpYbbrghz33uc1fc10033ZSPf/zjOf/88xd/9rGP
fSz//M//nOuvv/6IMnjxxRfne9/7Xm666abccccd+YM/+IMkyY033phLLrkkV199de6888686EUv
ykUXXZR///d/P46RONIQRbPH89KTPnPJNI1M0/WYS6ZpZJqux1wyTSPTdD3mkmkamfpUa83Tn/70
nHrqqdm+fXtuuOGGvOIVr5h030c/+tHZtm1bbrjhhiTJO9/5zlx44YX5yZ/8yWXv8/M///M57bTT
ctFFF+XSSy/NC1/4wsVSOT8/nwc84AG53/3ud5/73H777fnQhz6Uq666Ktu2bcvJJ5+cJzzhCUmS
N77xjXnRi16URz/60Sml5PnPf37ud7/75ZOf/OTxDMcRhiiaAAAAPSml5L3vfW/uuuuufP/7389f
/MVf5IILLsgdd9wx6f7Pf/7z87a3vS1J8ra3vS0XX3zxUW9/44035s4778zNN9+c1772tff52dln
n73kfW699dacdtpp2bZt2xE/++IXv5grrrgip5566uLltttuy+233z4p/0qs0QQAALo00hrNJHnQ
gx6Uq666Kr/5m7+Zpz3taXnyk5+8+AFBr3/96/OBD3wgH//4x5Mkt912W84777zs2bMnF1xwQfbv
33/EO5Izh6/RnNm3b1/OPffcxfWYh1+3f//+nHXWWbnzzjuPKJsvfvGLc8455+SP/uiPpo2KNZoA
AACrb1a8aq2L724+4hGPSJLs2rUrf/3Xf53vfve7ufnmm3PNNdfcZ83mWWedlV/4hV/I85///Dzj
Gc9YtmSeiDPPPDNPfepT87u/+7s5cOBAfvCDH+RjH/tYkuTSSy/NVVddlb//+79PrTXf/va384EP
fCDf+ta3mux7iKLZ6zngPeaSaRqZpusxl0zTyDRdj7lkmkam6XrMJdM0MvXr137t17J169Zs27Yt
f/zHf5y3vOUti0XzZS97WX78x388Z5xxRl74whfmec973hH3f8ELXpDPfvazK542e7S/ibnUzw69
7q1vfWt+7Md+LA9/+MNzxhln5M///M+TJI961KNy9dVX5/d///dz2mmn5Wd+5mfylre8ZdK/e4qT
mz0SAADAmli+eK2VW2655ag/P/3003P99dff57pXv/rV99l+yEMekrPPPjsXXHDBUR/rhz/84ZLX
79ix44ifHX7dqaeemmuvvXbJ+z/5yU/Ok5/85KPu+3hZowkAAHRpuXWBG8EPfvCDPPvZz87555+f
V73qVesdZ0XWaAIAAHTsn/7pn3Lqqadm//79eelLX7recVbFEEWz13PAe8wl0zQyTddjLpmmkWm6
HnPJNI1M0/WYS6ZpZNp4HvGIR+Rb3/pWPvGJT+SUU05Z7zirYoiiCQAAwDis0QQAALq0kddojsYa
TQAAANbVEEWz13PAe8wl0zQyTddjLpmmkWm6HnPJNI1M0/WYS6ZpZGJEQxRNAAAAxmGNJgAA0KWN
ukZzy5Ytufnmm3Puuedm9+7dOfvss/Mnf/InJ/y4r3vd6/Kv//qvufrqqxukvC9rNAEAgA2rlLLq
lyk+8YlP5HGPe1y2b9+e008/Pb/8y7+cf/iHfzjuf89Srr322px00knZunVrtm3blvPPPz8f+MAH
ln2syy+/fFVK5vEYomj2eg54j7lkmkam6XrMJdM0Mk3XYy6ZppFpuh5zyTSNTEuYX8XLBN/85jfz
tKc9LZdddlnuuuuufPnLX86rX/3q3O9+9zvmf0qSo75r+/jHPz533313Dhw4kEsuuSTPfOYz841v
fOOI2/3whz88rn2vliGKJgAAQC++8IUvpJSSZz3rWSml5P73v3+e9KQn5bzzzlu8zZvf/OY88pGP
zGmnnZanPOUp+dKXvnRc+5qV0FJKXvjCF+a73/1ubr755szPz+cZz3hGLr744mzbti3XXntt5ufn
c/HFFy/ed/au66mnnppzzjkn1113XZLk+9//fl7xilfkIQ95SB784Afnd37nd/K9733vBEbkSEMU
zbm5ufWOsKQec8k0jUzT9ZhLpmlkmq7HXDJNI9N0PeaSaRqZ+vOwhz0sJ510Unbv3p0PfehDueuu
u+7z8/e+97153etel/e85z352te+lic84Ql5znOec0L7vOeee/KmN70pW7duzUMf+tAkyd/8zd/k
t37rt/KNb3wjz33uc+9zCu4Xv/jF/Oqv/mouu+yyfO1rX8vevXuza9euJMkrX/nK3Hzzzfn0pz+d
m2++OV/+8pfz2te+9oTyHW6IogkAANCLrVu35hOf+ERKKbn00kvzoAc9KL/+67+eO+64I0ly1VVX
5fLLL8/DHvawbNmyJZdffnn27t2bW2+99Zj39clPfjKnnnpqzjzzzLzrXe/Ke97znmzdujVJ8rjH
PS4XXXRRkuT+97//fU7Bffvb354nPelJedaznpWTTjopp512Wn7u534utdZcffXVufLKK7N9+/ac
csopufzyy/POd76zwcjca4iiue7ngC+jx1wyTSPTdD3mkmkamabrMZdM08g0XY+5ZJpGpj49/OEP
z1/91V/l1ltvzec+97n827/9W1760pcmOfhu4mWXXZZTTz01p556ak4//fQkyZe//OVj3s9jHvOY
3HXXXfnqV7+av/u7v8sTn/jExZ+dddZZy97v1ltvzbnnnnvE9V/96lfzne98J4961KMW8z31qU/N
1772tWPOdjRDFE0AAIBePexhD8sLXvCCfO5zn0uSnHPOOXnjG9+Yu+66a/Hy7W9/O495zGOa7XOl
T8g955xz8i//8i9HXP/ABz4wD3jAA3LTTTctZjtw4EC++c1vNsuWDFI0ez0HvMdcMk0j03Q95lrr
TFM+Bv3CCy9c00xTeO6m6zGXTNPINF2PuWSaRqb+fP7zn8+VV165+A7lrbfemne84x157GMfmyR5
8YtfnD/90z/NTTfdlCT5xje+kXe/+91LPtbx/p3Qle7327/92/nbv/3bvPvd784999yTr3/96/n0
pz+dLVu25NJLL81LX/rSfPWrX01y8J3WD3/4w8eVYzlDFE2A9VdXuAAAm8XWrVvzqU99Kr/0S7+U
U045JY997GPzsz/7s7niiiuSJE9/+tPzh3/4h3n2s5+dbdu25bzzzsv111+/eP9D34k82juTx/qz
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
T4+5eswEMGOOAoDNYYiiCQAAwDiGKJq9runpMVePmQBmzFEAsDkMUTQBAAAYxxBFs9c1PT3m6jET
wIw5CgA2hyGKJgAAAOMYomj2uqanx1w9ZgKYMUcBwOYwRNEEAABgHEMUzV7X9PSYq8dMADPmKADY
HIYomgAAAIxjiKLZ65qeHnP1mAlgxhwFAJvDEEUTAACAcQxRNHtd09Njrh4zAcyYowBgcxiiaAIA
ADCOIYpmr2t6eszVYyaAGXMUAGwOQxRNAAAAxjFE0ex1TU+PuXrMBDBjjgKAzWGIogkAAMA4Tl7v
AFP0uqanx1w9ZgI2h1LKpNvVWlc5CQCw3oYomgCMYqUSOa2MAgBjG+LU2V7X9PSYq8dMAADA5rJi
0SylnF1K+Wgp5R9LKZ8rpfzHhevnSym3lVJuXLg8ZfXjAgAA0Lspp87+IMnLaq17SymnJPl/Sykf
ycHzo66stV65qgnT77rDHnP1mAkAANhcViyatdavJPnKwvffKqX8U5KfWvixxTYAAADcxzGt0Syl
7EhyfpJPLlz1klLKp0sp15RStjfOtqjXdYc95uoxEwAAsLlM/tTZhdNm/58kly28s/mXSV678OM/
SXJFkksOv9/u3buzY8eOJMn27duza9euxdM7Z6Vope2Zqbdfq+29e/d2lWfPnj3Zu3dvV3nu45aF
rzuX3m6+v8y255bc7mV87nO68y1ZdnwWt2f/mhb7y54sNz73brfZX/PxWuF4mt2n3fOzZ+Hrcttt
97dmr79Dsjfd32jHU7LGr789C19X2m6zvzU7nszn90Y2n0/Pbz6ftL3IfH7U7STm8wnbi45jPt+7
d28OHDiQJNm3b1+WU6b8PbNSyo8leX+S/1Fr/T+X+PmOJO+rtZ532PXV30ujlJLMr3Cj+XZ/W+/g
3/Jb+U8s9HZsThqnpNlYTRunZNixmndMGafp1nKsvPaOcX8DHlPm8+kcU9MYp+nM59O0HKdSSmqt
Ryyp3DLhjiXJNUluOrRkllLOPORmv5HksyumAAAAYMNbsWgmeXyS5yW58JA/ZfLUJG8opXymlPLp
JBckedlqhTzyLfw+9Jirx0wAAMDmMuVTZz+RpQvp/2gfBwAAgNFNeUdz3d13sXs/eszVYyYAAGBz
GaJoAgAAMI4himav6w57zNVjJgAAYHOZ/Hc0WV8HP/x3mt4+PhkAANhchiiava47XPtc0/5ODwAA
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
RpdNk8t2RPM+SR+U9KrxAZJ2lXQmcL9dNtk0OJdNNg3BZZNNQ3DZZNMQXDZ1yrajeSKwGLhGzTnE
Y8DVwC7ACXbZZNPgXDbZNASXTTYNwWWTTUNw2dQp1amzzjnnnHPOOedmf9mOaE4k6eCRvw+pZemW
0WVTWTaVl9FlU1k2lZfRZVNZNpWX0WVTWTaVl9FlU+IdTeDdI3+fVkXx4jK6bCrLpvIyumwqy6by
MrpsKsum8jK6bCrLpvIyugZv8qmzzjnnnHPOOed6bV5twGiS5gCHAru3gzYCa6LyHnFGl0029V1G
l0029V1Gl0029V1Gl0029V1Gl02d1810RFPS0cB5wD3Ag+3gJcBy4PSIuNQum2wajssmm4bgssmm
IbhssmkILptGiog0D2ADsGyK4XsDG+yyyaZhuWyyaQgum2wagssmm4bgsmnyI9vNgObSHModbSN1
T/PN6LKpLJvKy+iyqSybysvosqksm8rL6LKpLJvKy+iyqVO2azTPB26QdBEvHNpdCpzUjqtVRpdN
NvVdRpdNNvVdRpdNNvVdRpdNNvVdRpdNnVJdowkgaX/gOCZfrLo6ItbXU+V02WRT32V02WRT32V0
2WRT32V02WRT32V02dR53Ww7ms4555xzzjnnZneprtGUtFDSSkkbJI1J2tQ+XylpoV022TQsl002
DcFlk01DcNlk0xBcNk0u1Y4msAoYAw4HFkXEIuAIYHM7zi6bbBqWyyabhuCyyaYhuGyyaQgumzql
OnVW0l0Rsc9LHbety+iyyaa+y+iyyaa+y+iyyaa+y+iyyaa+y+iyaXLZjmjeJ+mDkl41PkDSrpLO
BO63yyabBueyyaYhuGyyaQgum2wagsumTtl2NE8EFgPXqDmHeAy4GtgFOMEum2wanMsmm4bgssmm
IbhssmkILps6pTp11jnnnHPOOefc7C/bEU3nnHPOOeecc7M872g655xzzjnnnOs172g655xzzjnn
nOu1ebUBo0l6BfDKiPjXkeEHRMS6SiwkvRF4OCLulPTzwM8B6yPiH22aZEo3/zJOp9EknR0RH6rt
6Cbp1cBBwO0RsaGiYyFwDLBHO+hB4NKI2FzRlG6ZkrQjzXRaAjwP3AlcFhHP1zJ1y7I8bSlJR0XE
5ZVeO+NynmqZkrQX8EhE/EjSHGAFcDBwO/B/IuLZSq5U06njWgI8FRGbJL0GOBBYFxF3VTRl3EZI
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
AkjaFVhdyZR1WmVcn2f8PM64Pk+5nJNz/p0KHEuzcft6mtPFoTH+oU1NSddRb6N5j32EZlpdCpxF
s6N3SiUTwBnAdDdvOn4mId2ybSNQcd2Z/q6zzjmXufbmLTtGsjsVOuecc65uQ99GSLejKekY4C3A
Hu2gB4GvRkTVU5oyuqYwbQQutsmmn7aMrlliyrg+yGiqPu/A02orTJ5Os8QEnn//wUzV5910Sfqj
iPjjiq/v+bcVbev5l2pHU9I5NL8VdAHNggKwhOaw/D0R8V67bLJpOC6bbBqCyyabhuCyafaatpSk
ByJiaaXXTjetMpq21Laef9l2NO+OiOVTDBfNXa1q/W5eOpdNNvVdRpdNNvVdRpdNNvVdRpdNs9r0
+BZGvzwiqtz4Kum0ymiqNv+y3QzoaUmHTjH8UJrfoKlVRpdNZdlUXkaXTWXZVF5Gl01l2VReRpdN
ZWU0jQHLI2LH0QfNb1zXKuO0ymiqNv+y/bzJCuB/q7nL5IPtsCU0d5RaUckEOV022dR3K8jnssmm
vltBPpdNNvXdCvK5bJq9pr+h+TmTh6cYd9EMW7qtIN+0ymiqNv9SnTo7nqTd6FxAGxFTTZgZL6PL
prJsKi+jy6aybCovo8umsmwqL6PLprIymrKWcVplNNUo26mzAETEQxFxY0TcCJxW2zNeRpdNZdlU
XkaXTWXZVF5Gl01l2VReRpdNZWU0dZN0Vm3DeBmnVUZTt5mafyl3NEc6rjZgmjK6bCrLpvIyumwq
y6byMrpsKsum8jK6bCrLpvIyugZrmg07mqoNmKaMLpvKsqm8jC6byrKpvIwum8qyqbyMLpvKsqm8
jK7BmlJeo9lN0pyIeL62Y7SMLpvKsqm8jC6byrKpvIyupKa5EfFcbUc3m8rL6LKprKTrg3QmyOka
sinVEU1Ji0f+PgU4R9K72t+fqZKk4yXt0j7/z5IuANZJ+jtJS2yaMO0i6cOSfkfSHEn/DbhE0p9L
2tmmvKasLptmr6l1/aKkT0taLekfgLMlVfldwRHXMZI+I+kSSZcAn5Z0jE1bbnzjW9If1TK00+md
kpaNmE61Kb/LpiLPfEknj7//Jb0dOLc1VtkWzmjaQlfUBkzRYE2pjmhKWhsRB7XP/zvwX4C/BX4N
eCAi3lfJdUdE7Nc+XwVcD3wZOBL47Yg4yiaQ9HVgHfAKYD/gVuBLwFHAAREx4+eo2zS7XTbNatNK
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
ipctt7rT0gAAAABJRU5ErkJggg==
"
>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[40]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre> 
</pre></div>

</div>
</div>
</div>

</div>
    </div>
  </div>
</body>
</html>
