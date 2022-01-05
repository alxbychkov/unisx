<template>
    <header>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="head_flex">
                        <a href="" class="logo"><img src="../assets/img/logo.png" alt=""><span>Universal Synthetics</span></a>
                        <div class="top_list_wrp_all">
                            <ul class="top_list">
                                <router-link :to="{ name: 'Home'}" tag="li" active-class="active" exact>
                                    <a href="">home</a>
                                </router-link>
                                <router-link :to="{ name: 'Actions'}" tag="li" active-class="active">
                                    <a href="">operations</a>
                                </router-link>
                                <li><a href="https://app.gitbook.com/s/ZJzXI998HYkbVXBxp31w/" target="_blank">Doc</a></li>
                                <li><a href="https://app.gitbook.com/s/ZJzXI998HYkbVXBxp31w/" target="_blank">About</a></li>
                            </ul>
                        </div>
                        <div class="open_nav"> <img src="../assets/img/menu.svg" alt=""> </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script>
export default {
    name: 'Header'
}
</script>