//ykaner ©

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function toggle_options(img) {
	let open_img = 'https://image.flaticon.com/icons/svg/118/118738.svg';
	let close_img = 'https://image.flaticon.com/icons/svg/126/126492.svg';
	if (img.toggled) {
		cbxs.style.display = 'none';
		img.setAttribute('optionsVisible', false);
		img.src = close_img;
	} else {
		cbxs.style.display = '';
		img.src = open_img;
	}
	img.toggled = !img.toggled;
	chrome.storage.sync.set({
		'optionsVisible': img.toggled
	});
}

function add_controls(show, optionsVisible) {
	var control_element = htmlToElement('<fieldset> <legend>בחר איזה קורסים להציג</legend> <div id="cbxs"> <div> <input type="checkbox" id="in-a" name="a" value="סמסטר א"> <label for="a">סמסטר א</label> </div> <div> <input type="checkbox" id="in-b" name="b" value="סמסטר ב" checked> <label for="b">סמסטר ב</label> </div> <div> <input type="checkbox" id="in-c" name="c" value="סמסטר קיץ"> <label for="c">סמסטר קיץ</label> </div> <div> <input type="checkbox" id="in-x" name="x" value="אחר"> <label for="x">כל דבר שהוא לא קורס - ספריה וכו</label> </div> </div> </fieldset>');

	var course_box = document.getElementsByClassName('courses frontpage-course-list-enrolled')[0];
	var front_page = document.getElementById('frontpage-course-list');
	front_page.insertBefore(control_element, course_box);

	var img = document.createElement('img');
	img.width = img.height = 16;
	img.toggled = !optionsVisible; //start in the opposite state
	toggle_options(img); // initialize to the real state by toggling
	control_element.insertBefore(img, control_element.firstChild);
	var cbxs = control_element.querySelector('#cbxs');
	img.onclick = function () {
		toggle_options(img);
	};


	var in_a = control_element.querySelector('#in-a');
	var in_b = control_element.querySelector('#in-b');
	var in_c = control_element.querySelector('#in-c');
	var in_x = control_element.querySelector('#in-x');

	chck_boxes = [in_a, in_b, in_c, in_x];

	for (let cb of chck_boxes) {
		cb.checked = show[cb.name];
	}

	function changed(cb) {
		show[cb.name] = cb.checked;
		chrome.storage.sync.set({
			"show": show
		}, () => {
			console.log("Changes synced");
		});
	}

	for (let cb of chck_boxes) {
		cb.addEventListener('change', event => {
			changed(event.target);
			course_filter(show);
		});
	}

	course_filter(show);

	}


	var courses;
	var semester = [];

	function classify_courses() {
		var all_regex = /^[א-ת\s!"#$%&'()*+,./:;<=>?@\^_`{|}~-]+[\d\s]+[אבק]\d*$/m;

		var names = [];
		courses = document.getElementsByClassName('coursebox clearfix');

		for (var i = 0; i < courses.length; i++) {
			var c = courses[i];
			var name_node = c.getElementsByClassName('coursename')[0];
			if (name_node == undefined) {
				console.log('name not found');
				continue;
			}
			var name = name_node.innerText;

			names.push(name);
			if (!all_regex.test(name)) {
				semester[i] = 'x';
				continue;
			}

			var last = name.split(' ').pop();
			if (/[אבק]\d{2}\s/.test(last)) {
				semester[i] = {
					א: 'a',
					ב: 'b',
					ק: 'c'
				}[last[0]];
			} else {
				semester[i] = 'x';
			}

			delete name;
		}
	}

	function course_filter(show) {

		var shown = 0;
		for (var i = 0; i < courses.length; i++) {
			var c = courses[i];
			if (!show[semester[i]]) {
				c.style.display = 'none';
			} else {
				c.style.display = '';
				if (shown % 2 == 0) {
					c.classList.remove('even');
					c.classList.add('odd');

					if (shown == 0) {
						c.classList.add('first');
					}
				} else {
					c.classList.remove('odd');
					c.classList.add('even');
				}
				shown++;
			}
		}
	}

	function init() {
		var default_show = {
			a: false,
			b: true,
			c: false,
			x: false
		};
		chrome.storage.sync.get(null, storage => { // null - get entire storage
			let show = storage.show || default_show; //first value that evaluates to true (not undefined)
			let optionsVisible = storage.optionsVisible;//x || true will always give true
			if(optionsVisible == undefined) optionsVisible = true;//default to true
			classify_courses();
			add_controls(show, optionsVisible);
		});
	}
window.addEventListener('load', init);