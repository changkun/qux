<template>
  <footer class="footer">
    <ul class="footer__list container">
      <li class="footer__item">
        <h2 class="footer__title">Copyright © 2017-2018 Ou Changkun</h2>
        <div class="footer__body"><span>LMU · Medieninformatik · Praktical Course Design Workshop 2</span></div>
        <div class="footer__body"><a href="https://github.com/changkun">Ou Changkun</a><span> - </span><span>Website developer</span></div>
        <div class="footer__body"><a href="mailto:florian.lachner@ifi.lmu.de">Florian Lachner</a><span> - </span><span>Supervisor</span></div>
        <div class="footer__body"><a href="http://www.medien.ifi.lmu.de/team/andreas.butz/">Andreas Butz</a><span> - </span><span>Professor</span></div>
      </li>
      <li class="footer__item">
        <h2 class="footer__title">Resources</h2>
        <div class="footer__body"><a target="_blank" href="https://github.com/changkun/qux-tool"><span>Github repository</span></a></div>
        <div class="footer__body"><a target="_blank" href="https://www.medien.ifi.lmu.de/pubdb/publications/pub/lachner2016nordichi/lachner2016nordichi.pdf"><span>Paper</span></a></div>
      </li>

    </ul>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',
}
</script>

<style lang="scss" scoped>
@import "~styles/exports";

.footer {
  min-height: 200px;
  padding: 20px 0;
  margin-top: 100px;
  font-size: 12px;
  background-color: #324057;
  color: #768193;
  position: relative;
  top: 0px;
  bottom: 0;
  width: 100%;
  &__list {
    list-style: none;
    padding-left: 0;
  }

  &__item {
    @include border-box();

    float: left;
    width: 50%;
    padding: 24px 2%;
  }

  &__title {
    font-size: 14px;
    margin: 0 auto 8px;
    font-weight: 500;
    position: relative;
    color: #a4aebd;
  }

  &__body {
    margin: 0 0 5px;

    a {
      color: #eee;
    }
  }
}
</style>
