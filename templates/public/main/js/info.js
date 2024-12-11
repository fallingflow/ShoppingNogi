export class Pagination {
    constructor(data, itemsPerPage){
        this.data = data;
        this.totalCount = data.length;

        this.itemsPerPage = itemsPerPage;
        this.totalPage = Math.ceil(data.length / itemsPerPage);
        this.pageGroupNum = 10
        this.isAscending = true;

    }

    renderPagination(currentPage){

        if(this. totalCount <= 20) return;

        let pageGroup = Math.ceil(currentPage / this.pageGroupNum);

        let end = pageGroup * this.pageGroupNum;
        if (end > this.totalPage) end = this.totalPage;
        let start = end - (this.pageGroupNum - 1) <= 0 ? 1 : end - (this.pageGroupNum - 1);

        const fragmentPage = document.createDocumentFragment();

        let prev = start - 1;
        let next = end + 1;

        if (prev > 0){
            let allpreli = document.createElement('li');
            allpreli.insertAdjacentHTML("beforeend", `<a href="#" id="allprev">&lt;&lt;</a>`);

            let preli = document.createElement('li');
            preli.insertAdjacentHTML("beforeend", `<a href="#" id="prev">&lt;</a>`);

            fragmentPage.appendChild(allpreli);
            fragmentPage.appendChild(preli);
        }
        for (let i = start; i <= end; i++){
            const li = document.createElement('li');
            let $li = $(li)
            if (i == currentPage){
                li.insertAdjacentHTML("beforeend", `<a href="#" id="page-${i}" style="padding:2px 5px; font-weight:bold; color:#F09319; background-color: #666;">${i}</a>`);
            }
            else{
                li.insertAdjacentHTML("beforeend", `<a href="#" id="page-${i}" style="padding:5px; font-weight:bold;">${i}</a>`);
            }
            fragmentPage.appendChild(li)

        }
        if(end < this.totalPage){
            let allendli = document.createElement('li');
            allendli.insertAdjacentHTML("beforeend", `<a href="#" id="allnext">&gt;&gt;</a>`);

            let endli = document.createElement('li');
            endli.insertAdjacentHTML("beforeend", `<a href="#" id="next">&gt;</a>`);

            fragmentPage.appendChild(endli);
            fragmentPage.appendChild(allendli);
        }
        document.getElementById('paging').appendChild(fragmentPage);

        $('#paging a').click((e)=> {
            e.preventDefault();
            let $clickedItem = $(e.currentTarget);
            let $id = $clickedItem.attr('id');
            let selectedPage

            if ($id == 'prev') {
                selectedPage = prev
            } else if ($id == 'next') {
                selectedPage = next
            } else if ($id == 'allprev') {
                selectedPage = 1;
            } else if ($id == 'allnext') {
                selectedPage = this.totalPage;
            } else {
                selectedPage = parseInt($clickedItem.text());
            }

            document.getElementById('paging').innerHTML = ""
            this.renderPagination(selectedPage)
            this.drawTable(selectedPage)

        });

        const parent = document.getElementById('paging').parentElement;
        const paging = document.getElementById('paging');
        const parentWidth = parent.offsetWidth;
        const pagingWidth = paging.offsetWidth;
        paging.style.marginLeft = `${(parentWidth - pagingWidth-50) / 2}px`;
    }

    drawTable(n){
        let table = document.getElementById('item-list')
        table.style.display='table';
        table.innerHTML = ""

        let thead = document.createElement('thead')
        table.appendChild(thead)

        let tr = document.createElement('tr')
        thead.appendChild(tr)

        let th = document.createElement('th')
        th.innerText = '번호'
        tr.appendChild(th)

        th = document.createElement('th')
        th.innerText = '아이템명'
        th.id = 'item-list-header-name'
        tr.appendChild(th)

        th = document.createElement('th')
        th.innerText = '시간'
        th.id = 'item-list-header-time'

        th.addEventListener('click', () => {
            this.data.sort((a, b) => {
                if (this.isAscending) {
                    return new Date(b.date_auction_expire) - new Date(a.date_auction_expire);
                } else {
                    return new Date(a.date_auction_expire) - new Date(b.date_auction_expire);
                }
            });
            this.isAscending = !this.isAscending; // Toggle the sorting order
            document.getElementById('paging').innerHTML = "";
            this.renderPagination(1);
            this.drawTable(1);
        });
        th.style.cursor = 'pointer';
        tr.appendChild(th)

        th = document.createElement('th')
        th.innerText = '수량'
        th.id = 'item-list-header-count'
        tr.appendChild(th)

        th = document.createElement('th')
        th.innerText = '가격'
        th.id = 'item-list-header-price'

        th.addEventListener('click', () => {
            this.data.sort((a, b) => {
                if (this.isAscending) {
                    return b.auction_price_per_unit - a.auction_price_per_unit;
                } else {
                    return a.auction_price_per_unit - b.auction_price_per_unit;
                }
            });
            this.isAscending = !this.isAscending; // Toggle the sorting order
            document.getElementById('paging').innerHTML = "";
            this.renderPagination(1);
            this.drawTable(1);
        });
        th.style.cursor='pointer';
        tr.appendChild(th)

        let tbody = document.createElement('tbody')
        table.appendChild(tbody)

        for (let i=0; i<this.itemsPerPage; i++){

            let itemIndex = this.itemsPerPage * (n-1) + i
            let item = this.data[itemIndex];

            if(item == null) break;

            let tr = document.createElement('tr')
            tbody.appendChild(tr)

            let td = document.createElement('td')
            td.classList.add('item-list-no')
            td.innerText = itemIndex + 1;
            tr.appendChild(td)

            td = document.createElement('td')
            td.classList.add('item-list-name')

            let btn = document.createElement('button');
            btn.innerText = item['item_display_name']

            // 툴팁
            const tooltip = document.createElement('div');
            tooltip.id = 'tooltip';
            let $tooltip = $(tooltip);

            // 툴팁 - 이름
            const detail_item_name = document.createElement('div')
            detail_item_name.innerText = item['item_display_name']
            let $detail_item_name = $(detail_item_name)
            $detail_item_name.css({
                textAlign: 'center',
                color: '#fff',
                padding: '5px',
                borderRadius: '5px',
                display: 'block',
            })
            tooltip.appendChild(detail_item_name)

            let item_option = item['item_option'];
            if(item_option != null){
                // 툴팁 - 아이템 속성
                let isPropertyAvailable = false
                let detail_item_option
                let legend

                let detail_item_option_content

                for (let i=0; i<item_option.length; i++) {
                    if(!isPropertyAvailable){
                        detail_item_option = document.createElement('fieldset')
                        legend = document.createElement('span')
                        legend.classList.add('item-option-legend')
                        legend.innerText = "아이템 속성"
                        detail_item_option.appendChild(legend)

                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        item_option = item['item_option'];

                        isPropertyAvailable = true
                    }
                    if (item_option[i]['option_type'] == '공격'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "공격 " + item_option[i]['option_value'] + "~" + item_option[i]['option_value2'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if (item_option[i]['option_type'] == '부상률'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "부상률 " + item_option[i]['option_value'] + "~" + item_option[i]['option_value2'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if (item_option[i]['option_type'] == '크리티컬'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "크리티컬 " + item_option[i]['option_value'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if (item_option[i]['option_type'] == '밸런스'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "밸런스 " + item_option[i]['option_value'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if (item_option[i]['option_type'] == '내구력') {
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "내구력 " + item_option[i]['option_value'] + "/" + item_option[i]['option_value2'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if (item_option[i]['option_type'] == '숙련') {
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "숙련 " + item_option[i]['option_value'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if (item_option[i]['option_type'] == '아이템 보호') {
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "(" + item_option[i]['option_value'] + " 시 아이템 보호)";
                        let $detail_item_option_content = $(detail_item_option_content)
                        $detail_item_option_content.css('color', '#0098FD')
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if(item_option[i]['option_type'] == '피어싱 레벨') {
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')

                        let detail_item_option_content_ex = document.createElement('span')
                        detail_item_option_content_ex.innerText = "피어싱 레벨 " + item_option[i]['option_value'];
                        let $detail_item_option_content_ex = $(detail_item_option_content_ex)
                        $detail_item_option_content_ex.css('color', '#0098FD')
                        detail_item_option_content.appendChild(detail_item_option_content_ex)

                        if(item_option[i]['option_value2'] != null){
                            let detail_item_option_content_ex2 = document.createElement('span')
                            detail_item_option_content_ex2.innerText = " "+item_option[i]['option_value2'];
                            let $detail_item_option_content_ex2 = $(detail_item_option_content_ex2)
                            $detail_item_option_content_ex2.css('color', '#F09319')
                            detail_item_option_content.appendChild(detail_item_option_content_ex2)
                        }

                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if(item_option[i]['option_type'] == '남은 전용 해제 가능 횟수'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "남은 전용 해제 가능 횟수 : " + item_option[i]['option_value'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    // 인챈트
                    if(item_option[i]['option_type'] == '내구도'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "내구도 " + item_option[i]['option_value'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if(item_option[i]['option_type'] == '인챈트 종류'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "["+item_option[i]['option_sub_type'] +"] " + item_option[i]['option_value'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if(item_option[i]['option_type'] == '남은 거래 횟수'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = "남은 거래 가능 횟수 : " + item_option[i]['option_value'];
                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if(item_option[i]['option_type'] == '에코스톤 등급'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        detail_item_option_content.innerText = + item_option[i]['option_value']+' 등급';
                        let $detail_item_option_content = $(detail_item_option_content)
                        $detail_item_option_content.css('color', '#FCB449')
                        detail_item_option.appendChild(detail_item_option_content)
                    }if(item_option[i]['option_type'] == '에코스톤 고유 능력'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        let detail_item_optoin_content_ex = document.createElement('div')
                        detail_item_optoin_content_ex.innerText = '고유 능력'
                        let detail_item_option_content_ex2 = document.createElement('div')
                        detail_item_option_content_ex2.innerText = item_option[i]['option_sub_type']+' '+item_option[i]['option_value']+' 증가'
                        let $detail_item_option_content_ex2 = $(detail_item_option_content_ex2)
                        $detail_item_option_content_ex2.css('color', '#0098FD')

                        detail_item_option_content.appendChild(detail_item_optoin_content_ex)
                        detail_item_option_content.appendChild(detail_item_option_content_ex2)

                        detail_item_option.appendChild(detail_item_option_content)
                    }
                    if(item_option[i]['option_type'] == '에코스톤 각성 능력'){
                        detail_item_option_content = document.createElement('div')
                        detail_item_option_content.classList.add('item-option-content')
                        let detail_item_optoin_content_ex = document.createElement('div')
                        detail_item_optoin_content_ex.innerText = '각성 능력'
                        let detail_item_option_content_ex2 = document.createElement('div')
                        detail_item_option_content_ex2.innerText = item_option[i]['option_value']
                        let $detail_item_option_content_ex2 = $(detail_item_option_content_ex2)
                        $detail_item_option_content_ex2.css('color', '#0098FD')

                        detail_item_option_content.appendChild(detail_item_optoin_content_ex)
                        detail_item_option_content.appendChild(detail_item_option_content_ex2)

                        detail_item_option.appendChild(detail_item_option_content)
                    }



                }

                tooltip.appendChild(detail_item_option)

                // 툴팁 - 인챈트
                let isEnchantAvailable = false
                let item_option_enchant_container
                let item_option_enchant_prefix
                let item_option_enchant_suffix
                let item_option_enchant_prefix_ex
                let item_option_enchant_suffix_ex

                for(let i=0; i<item_option.length; i++) {
                    if (item_option[i]['option_type'] == '인챈트') {
                        if (!isEnchantAvailable) {
                            detail_item_option = document.createElement('fieldset')
                            legend = document.createElement('span')
                            legend.classList.add('item-option-legend')
                            legend.innerText = "인챈트"
                            detail_item_option.appendChild(legend)

                            detail_item_option_content = document.createElement('div')
                            detail_item_option_content.classList.add('item-option-content')
                            item_option = item['item_option'];

                            isEnchantAvailable = true
                        }
                        if (item_option[i]['option_sub_type'] == '접두') {
                            item_option_enchant_container = document.createElement('div')
                            item_option_enchant_prefix = document.createElement('div')
                            item_option_enchant_prefix_ex = document.createElement('div')

                            item_option_enchant_prefix.innerText = "[접두] " + item_option[i]['option_value']

                            // parse enchant ex
                            let enchant_ex = item_option[i]['option_desc'].split(',')
                            let item_option_enchant_ex_str
                            for (let j=0; j<enchant_ex.length; j++){
                                item_option_enchant_ex_str = document.createElement('div')
                                item_option_enchant_ex_str.innerText = enchant_ex[j]
                                let $item_option_enchant_ex_str = $(item_option_enchant_ex_str)
                                $item_option_enchant_ex_str.css('color', '#888')
                                item_option_enchant_prefix_ex.appendChild(item_option_enchant_ex_str)
                            }

                            // item_option_enchant_prefix_ex.innerText = item_option[i]['option_desc']

                            item_option_enchant_container.appendChild(item_option_enchant_prefix)
                            item_option_enchant_container.appendChild(item_option_enchant_prefix_ex)
                        }
                        if (item_option[i]['option_sub_type'] == '접미') {
                            item_option_enchant_container = document.createElement('div')
                            item_option_enchant_suffix = document.createElement('div')
                            item_option_enchant_suffix_ex = document.createElement('div')

                            item_option_enchant_suffix.innerText = "[접미] " + item_option[i]['option_value']

                            // parse enchant ex
                            let enchant_ex = item_option[i]['option_desc'].split(',')
                            let item_option_enchant_ex_str
                            for (let j=0; j<enchant_ex.length; j++){
                                item_option_enchant_ex_str = document.createElement('div')
                                item_option_enchant_ex_str.innerText = enchant_ex[j]
                                let $item_option_enchant_ex_str = $(item_option_enchant_ex_str)
                                $item_option_enchant_ex_str.css('color', '#888')
                                item_option_enchant_suffix_ex.appendChild(item_option_enchant_ex_str)
                            }

                            // item_option_enchant_suffix_ex.innerText = item_option[i]['option_desc']

                            item_option_enchant_container.appendChild(item_option_enchant_suffix)
                            item_option_enchant_container.appendChild(item_option_enchant_suffix_ex)

                            let $item_option_enchant_container = $(item_option_enchant_container)
                        }
                        detail_item_option.appendChild(item_option_enchant_container)
                        tooltip.appendChild(detail_item_option)
                    }
                }

                //툴팁 - 개조
                let isUpgradeAvailable = false
                let item_option_upgrade_container
                let item_option_upgrade_normal
                let item_option_upgrade_jewel
                let item_option_upgrade_art
                let item_option_upgrade_special
                let item_option_upgrade_ex
                let item_option_upgrade_ex_str

                for(let i=0; i<item_option.length; i++) {
                    if (item_option[i]['option_type'].includes('개조')) {
                        if (!isUpgradeAvailable) {
                            detail_item_option = document.createElement('fieldset')
                            legend = document.createElement('span')
                            legend.classList.add('item-option-legend')
                            legend.innerText = "개조"
                            detail_item_option.appendChild(legend)

                            detail_item_option_content = document.createElement('div')
                            detail_item_option_content.classList.add('item-option-content')
                            item_option = item['item_option'];

                            isUpgradeAvailable = true
                        }

                        item_option_upgrade_container = document.createElement('div')
                        item_option_upgrade_normal = document.createElement('div')
                        item_option_upgrade_jewel = document.createElement('div')
                        item_option_upgrade_art = document.createElement('div')
                        item_option_upgrade_special = document.createElement('div')
                        item_option_upgrade_ex = document.createElement('div')

                        if (item_option[i]['option_type'] == '일반 개조') {
                            item_option_upgrade_normal.innerText = "일반 개조 " + item_option[i]['option_value'] + "/" + item_option[i]['option_value2']
                            item_option_upgrade_container.appendChild(item_option_upgrade_normal)
                        }
                        if (item_option[i]['option_type'] == '보석 개조') {
                            item_option_upgrade_jewel.innerText = "보석 개조 " + item_option[i]['option_value']
                            item_option_upgrade_container.appendChild(item_option_upgrade_jewel)
                        }
                        if (item_option[i]['option_type'] == '장인 개조') {
                            item_option_upgrade_art.innerText = "장인 개조"

                            // parse upgrade ex

                            if(item_option[i]['option_value'] != null) {
                                let str = item_option[i]['option_value'].split(',')
                                let item_option_upgrade_ex_str
                                for (let j=0; j<str.length; j++){
                                    item_option_upgrade_ex_str = document.createElement('div')
                                    item_option_upgrade_ex_str.innerText = str[j]
                                    let $item_option_upgrade_ex_str = $(item_option_upgrade_ex_str)
                                    $item_option_upgrade_ex_str.css('color', '#888')
                                    item_option_upgrade_ex.appendChild(item_option_upgrade_ex_str)
                                }
                            }

                            item_option_upgrade_container.appendChild(item_option_upgrade_art)
                            item_option_upgrade_container.appendChild(item_option_upgrade_ex)
                        }
                        if (item_option[i]['option_type'] == '특별 개조') {
                            let item_option_upgrade_special_ex = document.createElement('span')
                            let item_option_upgrade_special_ex2 = document.createElement('span')
                            item_option_upgrade_special_ex.innerText = '특별 개조 '
                            item_option_upgrade_special_ex2.innerText = item_option[i]['option_sub_type'] + item_option[i]['option_value']

                            let $item_option_upgrade_special_ex = $(item_option_upgrade_special_ex)
                            let $item_option_upgrade_special_ex2 = $(item_option_upgrade_special_ex2)
                            $item_option_upgrade_special_ex2.css('color', '#FF6A00')

                            item_option_upgrade_special.appendChild(item_option_upgrade_special_ex)
                            item_option_upgrade_special.appendChild(item_option_upgrade_special_ex2)

                            item_option_upgrade_container.appendChild(item_option_upgrade_special)
                        }
                        detail_item_option.appendChild(item_option_upgrade_container)
                        tooltip.appendChild(detail_item_option)
                    }
                }


                //툴팁 - 세공
                let isRefineAvailable = false
                let item_option_refine_container
                let item_option_refine_rank
                let item_option_refine_option
                let item_option_refine_option_ex

                for(let i=0; i<item_option.length; i++){
                    item_option_refine_container = document.createElement('div')
                    item_option_refine_rank = document.createElement('div')
                    item_option_refine_option = document.createElement('div')
                    item_option_refine_option_ex = document.createElement('div')

                    if(item_option[i]['option_type'] == '세공 랭크') {
                        if (!isRefineAvailable) {
                            detail_item_option = document.createElement('fieldset')
                            legend = document.createElement('span')
                            legend.classList.add('item-option-legend')
                            legend.innerText = "세공"
                            detail_item_option.appendChild(legend)

                            detail_item_option_content = document.createElement('div')
                            detail_item_option_content.classList.add('item-option-content')
                            item_option = item['item_option'];

                            isRefineAvailable = true
                        }

                        item_option_refine_rank.innerText = item_option[i]['option_value'] + ' 랭크'
                        let $item_option_refine_rank = $(item_option_refine_rank)
                        if (item_option[i]['option_value'] == 1) {
                            $item_option_refine_rank.css('color', '#CC4293')
                        } else if (item_option[i]['option_value'] == 2) {
                            $item_option_refine_rank.css('color', '#F3C121')
                        }
                    }
                    if(item_option[i]['option_type'] == '세공 옵션') {
                        let str = item_option[i]['option_value'].split('(')
                        item_option_refine_option.innerText = str[0]
                        item_option_refine_option_ex.innerText = '('+str[1]
                        let $item_option_refine_option = $(item_option_refine_option)
                        let $item_option_refine_option_ex = $(item_option_refine_option_ex)
                        $item_option_refine_option.css('color', '#0098FD')
                        $item_option_refine_option_ex.css('color', '#0098FD')
                    }


                    item_option_refine_container.appendChild(item_option_refine_rank)
                    item_option_refine_container.appendChild(item_option_refine_option)
                    item_option_refine_container.appendChild(item_option_refine_option_ex)
                    detail_item_option.appendChild(item_option_refine_container)
                    tooltip.appendChild(detail_item_option)

                }


                //툴팁 - 에르그
                let isErgAvailable = false
                let item_option_erg_container
                let item_option_erg_rank
                let item_option_erg_level
                let item_option_erg_max_level

                for (let i=0; i<item_option.length; i++){
                    if(item_option[i]['option_type'] == '에르그'){
                        if (!isErgAvailable) {
                            detail_item_option = document.createElement('fieldset')
                            legend = document.createElement('span')
                            legend.classList.add('item-option-legend')
                            legend.innerText = "에르그"
                            detail_item_option.appendChild(legend)

                            detail_item_option_content = document.createElement('div')
                            detail_item_option_content.classList.add('item-option-content')
                            item_option = item['item_option'];

                            isErgAvailable = true
                        }

                        item_option_erg_container = document.createElement('div')
                        item_option_erg_rank = document.createElement('div')
                        item_option_erg_level = document.createElement('div')
                        item_option_erg_max_level = document.createElement('div')

                        item_option_erg_rank.innerText = "등급 "+item_option[i]['option_sub_type']
                        let $item_option_erg_rank = $(item_option_erg_rank)
                        $item_option_erg_rank.css('color', '#CC4293')

                        item_option_erg_level.innerText = '레벨 '+item_option[i]['option_value']
                        item_option_erg_max_level.innerText = '최대 레벨 '+item_option[i]['option_value2']

                        item_option_erg_container.appendChild(item_option_erg_rank)
                        item_option_erg_container.appendChild(item_option_erg_level)
                        item_option_erg_container.appendChild(item_option_erg_max_level)
                        detail_item_option.appendChild(item_option_erg_container)
                        tooltip.appendChild(detail_item_option)
                    }
                }

                
                //툴팁 - 세트효과

                // 툴팁 - 아이템 염색
                let isColorAvailable = false
                let item_option_color_container
                let item_option_color
                let item_option_color_preview

                for(let i=0; i<item_option.length; i++){
                    if(item_option[i]['option_type'] == '아이템 색상'){
                        if(!isColorAvailable){
                            detail_item_option = document.createElement('fieldset')
                            legend = document.createElement('span')
                            legend.classList.add('item-option-legend')
                            legend.innerText = "아이템 염색"
                            detail_item_option.appendChild(legend)

                            detail_item_option_content = document.createElement('div')
                            detail_item_option_content.classList.add('item-option-content')
                            item_option = item['item_option'];

                            isColorAvailable = true
                        }

                        item_option_color_container = document.createElement('div')
                        item_option_color = document.createElement('span')
                        item_option_color_preview = document.createElement('span')

                        let $item_option_color_container = $(item_option_color_container)
                        let $item_option_color = $(item_option_color)
                        let $item_option_color_preview = $(item_option_color_preview)
                        let rgb

                        if(item_option[i]['option_value'] != null){
                            item_option_color.innerText = item_option[i]['option_sub_type'] + ": " + item_option[i]['option_value'];
                            item_option_color_preview.innerText ='　';
                            rgb = item_option[i]['option_value'].split(',')
                        } else if(item_option[i]['option_desc'] == "(반짝)"){
                            item_option_color.innerText = item_option[i]['option_sub_type'] + ": (반짝)"
                            rgb = "반짝"
                        }

                        $item_option_color.css({
                            padding: '2px',
                            borderRadius: '5px',
                            color: '#fff'
                        })
                        $item_option_color_preview.css({
                            width: '10px',
                            marginRight: '5px',
                            backgroundColor: (rgb == "반짝" ? null : 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')')
                        })
                        item_option_color_container.appendChild(item_option_color_preview)
                        item_option_color_container.appendChild(item_option_color)
                        detail_item_option_content.appendChild(item_option_color_container)

                    }
                }
                detail_item_option.appendChild(detail_item_option_content)
                tooltip.appendChild(detail_item_option)
            }

            $tooltip.css({
                width: '300px',
                position: 'absolute',
                backgroundColor: 'rgb(51, 51, 51)',
                color: '#fff',
                borderRadius: '5px',
                display: 'none',
                fontSize: '14px',
                fontFamily: 'MabinogiClassicR',
                padding: '7px',
                textAlign: 'left',
                lineHeight: '1.3',
            });

            td.append(tooltip);

            // TODO: 툴팁 길이가 화면 길이보다 길 경우 위치 처리
            btn.addEventListener('click', function(e) {
                tooltip.style.display = 'block';
                tooltip.style.left = e.pageX + 'px';
                tooltip.style.top = e.pageY  + 'px';
            });
            document.addEventListener('click', function(e) {
                if (!tooltip.contains(e.target) && e.target !== btn) {
                    tooltip.style.display = 'none';
                }
            });



            td.appendChild(btn)
            tr.appendChild(td)

            td = this.drawTableTime(item)
            tr.appendChild(td)

            td = this.drawTableCount(item)
            tr.appendChild(td)

            td = this.drawTablePrice(item)
            tr.appendChild(td)

        }
    }
    drawTablePrice(item){
        let td = document.createElement('td')
        td.classList.add('item-list-price')
        let span = document.createElement('span')
        span.innerText = "개당: "+this.parsePrice(item['auction_price_per_unit'])
        span.classList.add('item-list-price-per-unit')

        if(item['auction_price_per_unit'] >= 100000000){
            span.style.color = '#e88d90';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #9b3e42';
        } else if(item['auction_price_per_unit'] >= 10000){
            span.style.color = '#94c1dd';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #69889C';
        }

        td.appendChild(span)
        span = document.createElement('span')
        span.innerText = "전체: "+this.parsePrice(item['auction_price_per_unit'] * item['item_count'])
        span.classList.add('item-list-price-total')
        if(item['auction_price_per_unit'] * item['item_count'] >= 100000000) {
            span.style.color = '#e88d90';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #9b3e42';
        } else if(item['auction_price_per_unit'] * item['item_count'] >= 10000){
            span.style.color = '#94c1dd';
            // span.style.fontWeight = 'bold';
            span.style.textShadow = '0 0 5px #69889C';
        }
        td.style.width='250px'
        td.style.cursor='pointer'
        td.addEventListener('click', function(){
            window.open('sales/'+item['item_name'])
        })
        td.appendChild(span)
        span.style.display = 'block'

        return td
    }
    drawTableTime(item){
        let td = document.createElement('td')
        td.classList.add('item-list-time')
        td.innerText = this.parseTime(item['date_auction_expire'])
        td.style.width='120px'
        return td
    }
    drawTableCount(item){
        let td = document.createElement('td')
        td.classList.add('item-list-count')
        td.innerText = item['item_count']
        td.style.width='30px'
        return td
    }
    parsePrice(price) {
        let priceStr = price.toString();
        let priceLen = priceStr.length;

        if (priceLen <= 4) {
            return priceStr +" Gold";
        }

        let parsedPrice = "";
        let units = ["", "만", "억"];
        let unitIndex = 0;

        if (priceLen <= 4){ units = [""]; }
        else if (priceLen <= 8){ units = ["만", ""];}
        else if (priceLen <= 12){ units = ["억", "만", ""];}

        while (priceLen > 0) {
            let chunkSize = priceLen % 4 === 0 ? 4 : priceLen % 4;
            let chunk = priceStr.slice(0, chunkSize);
            priceStr = priceStr.slice(chunkSize);
            priceLen -= chunkSize;

            if (chunk !== "0000") {
                chunk = chunk.replace(/^0+/, "");
                parsedPrice = parsedPrice + "" + chunk + units[unitIndex];
            }
            unitIndex++;
        }

        return parsedPrice + " Gold";
    }

    parseTime(time){
        let date = new Date;
        let timeDate = new Date(time);
        let diff = timeDate - date
        if(diff < 0) return "만료"
        let diffSec = diff / 1000;
        let diffMin = diffSec / 60;
        let diffHour = Math.ceil(diffMin / 60);

        return diffHour + ' 시간'
    }
}

let items = []
function getDataByCategory(category, address, apikey, cursor = null, paging = 0) {
    let url = address + "?auction_item_category=" + category

    if (cursor != null) {
        url += "&cursor=" + cursor
    }
    $.ajax({
        method: "GET",
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-nxopen-api-key", apikey)
        },
        success: function (res) {
            items.push(res['auction_item']);
            if (paging < 2 && res['next_cursor'] != null) {
                paging++
                getDataByCategory(category, address, apikey, res['next_cursor'], paging)
            }else{
                let infos = getItemDetailInfo(items);

                console.log(infos)

                document.getElementById('paging').innerHTML = ""

                let pagination = new Pagination(infos, 20);
                pagination.renderPagination(1);
                pagination.drawTable(1);


                return infos
            }
        }
    });
}

function getDataByName(name, address, apikey, cursor = null, paging=0){
    let url = address + "?item_name=" + name

    if (cursor != null){
        url += "&cursor=" + cursor
    }
    $.ajax({
        method: "GET",
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-nxopen-api-key", apikey)
        },
        success: function (res) {
            items.push(res['auction_item']);
            if (paging < 2 && res['next_cursor'] != null) {
                paging++
                getDataByName(name, address, apikey, res['next_cursor'], paging)
            }else{
                let infos = getItemDetailInfo(items);

                console.log(infos)

                document.getElementById('paging').innerHTML = ""

                let pagination = new Pagination(infos, 20);
                pagination.renderPagination(1);
                pagination.drawTable(1);


                return infos
            }
        }
    });
}

function getItemDetailInfo() {
    let itemInfos = []
    items.forEach(i => {
        i.forEach(item => {
            itemInfos.push({
                "item_name": item['item_name'],
                "item_display_name": item['item_display_name'],
                "item_count": item['item_count'],
                "auction_price_per_unit": item['auction_price_per_unit'],
                "date_auction_expire": item['date_auction_expire'],
                "item_option": item['item_option']
            })
        })
    })
    return itemInfos
}





//////////////////////

export function searchItemList(word, type, URL, APIKEY){
    items = []

    switch(type){
        case 'category':
            getDataByCategory(word, URL, APIKEY)
            break;
        case 'name':
            getDataByName(word, URL, APIKEY)
            break;
    }


}