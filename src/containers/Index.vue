<template>
  <div class="content">
    <swiper :options="swiperOption">
      <!-- <swiper-slide class="slide-1">
        <div class="background">
          <div class="title" data-swiper-parallax="-100">Simple. Fast. Elegance.</div>
          <br>
          <div class="subtitle" data-swiper-parallax="-200">A Quantifiable Way of Describing User Experience</div>
          <div class="text" data-swiper-parallax="-300">
            <p>The tool aims to support a common organizational understanding of a product’s UX and the selection of further in-depth UX evaluations. The tool provides a systematic approach and an associated description of UX are needed to consider and measure the intended experience.</p>
          </div>
        </div>
      </swiper-slide> -->
      <swiper-slide class="slide-2">
        <div class="background">
          <div class="title" data-swiper-parallax="-100">Simple. Fast. Elegance.</div>
          <br>
          <div class="subtitle" data-swiper-parallax="-200">A Quantifiable Way of Describing User Experience</div>
          <div class="text" data-swiper-parallax="-300">
            <p>The tool aims to support a common organizational understanding of a product’s UX and the selection of further in-depth UX evaluations. The tool provides a systematic approach and an associated description of UX are needed to consider and measure the intended experience.</p>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide class="slide-3">
        <div class="background">
          <div class="title" data-swiper-parallax="-100">Simple. Fast. Elegance.</div>
          <br>
          <div class="subtitle" data-swiper-parallax="-200">A Quantifiable Way of Describing User Experience</div>
          <div class="text" data-swiper-parallax="-300">
            <p>The tool aims to support a common organizational understanding of a product’s UX and the selection of further in-depth UX evaluations. The tool provides a systematic approach and an associated description of UX are needed to consider and measure the intended experience.</p>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide class="slide-4">
        <div class="background">
          <div class="title" data-swiper-parallax="-100">Simple. Fast. Elegance.</div>
          <br>
          <div class="subtitle" data-swiper-parallax="-200">A Quantifiable Way of Describing User Experience</div>
          <div class="text" data-swiper-parallax="-300">
            <p>The tool aims to support a common organizational understanding of a product’s UX and the selection of further in-depth UX evaluations. The tool provides a systematic approach and an associated description of UX are needed to consider and measure the intended experience.</p>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide class="slide-5">
        <div class="background">
          <div class="title" data-swiper-parallax="-100">Simple. Fast. Elegance.</div>
          <br>
          <div class="subtitle" data-swiper-parallax="-200">A Quantifiable Way of Describing User Experience</div>
          <div class="text" data-swiper-parallax="-300">
            <p>The tool aims to support a common organizational understanding of a product’s UX and the selection of further in-depth UX evaluations. The tool provides a systematic approach and an associated description of UX are needed to consider and measure the intended experience.</p>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>
      <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
    
    </swiper>
    <div id="highlights">
      <div class="inner">
        <div class="point">
          <h2>Efficient</h2>
          <p>Get insights for any product. Fast, easy, and flexible.</p>
        </div>

        <div class="point">
          <h2>Holistic</h2>
          <p>Measure the overall UX of your product or service.</p>
        </div>

        <div class="point">
          <h2>Collaborative</h2>
          <p>Communicate your insights in your interdisciplinary team.</p>
        </div>
      </div>
    </div>
    <div id="highlights">
      <div class="paper">
        <div class="download">
          <h1>
            Scientific Background
          </h1>
          <p>
            <a href="https://www.medien.ifi.lmu.de/pubdb/publications/pub/lachner2016nordichi/lachner2016nordichi.pdf" target="_blank">
              <img src="/static/images/pdf.png" style="width: 300px;"></img>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'Index',
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        parallax: true,
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped>

#highlights {
  margin-top: 50px;
  background-color: #fff;
  .inner {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }
  .paper {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }
  .download {
    width: 500px;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 2em;
    h1 {
      font-family: "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
      color: #20a0ff;
      font-size: 2.0em;
      font-weight: 400;
      margin: 0;
      padding: .5em 0;
    }
  }
  .point {
    width: 33%;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 2em;
    h2 {
      font-family: "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
      color: #20a0ff;
      font-size: 1.5em;
      font-weight: 400;
      margin: 0;
      padding: .5em 0;
    }
  }
}


.swiper-slide {
  background-position: center;
  background-size: cover;
  background-color: transparent!important;
  height: 500px;
  width: audo;
  &.slide-1 {
    background-image:url('/static/images/1.jpg')
  }
  &.slide-2 {
    background-image:url('/static/images/2.jpg')
  }
  &.slide-3 {
    background-image:url('/static/images/3.jpg')
  }
  &.slide-4 {
    background-image:url('/static/images/4.jpg')
  }
  &.slide-5 {
    background-image:url('/static/images/5.jpg')
  }
  box-sizing: border-box;
  padding: 60px 0;
}
.swiper-slide .background {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 50px 100px;
}
.swiper-slide .title {
  color: #fff;
  font-size: 40px;
  font-weight: 300;
}
.swiper-slide .subtitle {
  color: #ccc;
  font-size: 25px;
}
.swiper-slide .text {
  font-size: 15px;
  max-width: 600px;
  p {
    color: #bbb;
  }
}
</style>
