/*!
 * dimsum.js v0.1
 * https://github.com/ninjascribble/dimsum
 * MIT licensed
 * 
 * Copyright (C) 2012 Scott Grogan, http://ninjascript.com
 */
;(function(global) {

var classic = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

	cicero_1_10_32 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",

	cicero_1_10_33 = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",

	config = {
		'format': 'text',
		'bounds': {
			'per_paragraph': {
				sentences: [3, 5]
			},
			'per_sentence': {
				words: [10, 31],
				commas: [0, 4]
			}
		}
	},

	punct = [',','.',';',':','?'],

	punct_reg = new RegExp('[' + punct.join('') + ']*','g'),

	latin = dedupe( normify([classic, cicero_1_10_32, cicero_1_10_33]).split(' ') ),

	dimsum = global.dimsum = module.exports = exports = {

		/**
		 * The standard Lorem Ipsum passage.
		 */
		classic: function() {
			return classic;
		},

		/**
		 * Section 1.10.32 of Cicero's "de Finibus Bonorum et Malorum".
		 */
		cicero32: function() {
			return cicero_1_10_32;
		},

		/**
		 * Section 1.10.33 of Cicero's "de Finibus Bonorum et Malorum".
		 */
		cicero33: function() {
			return cicero_1_10_33;
		},

		/**
		 * Override the current configuration.
		 *
		 * @param options
		 *		An object containing new config values.
		 */
		configure: function(options) {
			config = extend(config, options);
			return this;
		},

		/**
		 * Create a random chunk of lipsum. Returns an array containing
		 * the number of paragraphs specified.
		 *
		 * @param num_paragraphs
		 * 		How many paragraphs to generate.
		 *
		 * @param options
		 *		An object containing new config values. The new options
		 *		will only apply to this one execution.
		 */
		generate: function(num_paragraphs, options) {

			var config_1 = config,
				sentences = [],
				paragraphs = [],
				result = '',
				num_paragraphs = num_paragraphs || 1;

			this.configure(options);

			while (paragraphs.length < num_paragraphs) {
				paragraphs.push(this.paragraph());
			}

			switch(config.format) {
				case 'text':
					result = paragraphs.join("\r\n\r\n");
					break;
				case 'html':
					result = '<p>' + paragraphs.join('</p><p>') + '</p>';
					break;
			}

			config = config_1;
			return result;
		},

		/**
		 * Create a single sentence of random lipsum.
		 */
		sentence: function() {

			var word = '',
				words = [],
				num_words = range(config.bounds.per_sentence.words[0], config.bounds.per_sentence.words[1]),
				num_commas = range(config.bounds.per_sentence.commas[0], config.bounds.per_sentence.commas[1]);

			// Get some words
			while (words.length < num_words) {
				word = latin[ range(0, latin.length -1) ];
				words.push(word);
			}

			// Add some commas
			for (var i = 0; i < num_commas; i++) {
				word = range(4, words.length - 3);
				if (words[word].match(',')) {
					i--;
				}
				else {
					words[word] += ',';
				}
			}

			// Capitalize the first word
			words = words.join(' ');
			words = words.replace(/^[a-z]/i, words[0].toUpperCase());

			// Punctuate and return
			return words + '.';
		},

		/**
		 * Create a single paragraph of random lipsum.
		 */
		paragraph: function() {
			var sentences = [],
				num_sentences = range(config.bounds.per_paragraph.sentences[0], config.bounds.per_paragraph.sentences[1]);
			while (sentences.length < num_sentences) {
				sentences.push(this.sentence());
			}
			return sentences.join(' ');
		}

	};

	/** Utils **/
	function normify(strings) {
		return strings.join(' ')
				.toLowerCase()
				.replace(punct_reg, '');
	};

	function dedupe(array) {
		var obj = {},
			result = [];
		for (var i = 0; i < array.length; i++) {
			obj[array[i]] = null;
		}
		for (key in obj) {
			result.push(key);
		}
		return result;
	}

	function range(min, max) {
		return min + Math.random() * (max - min - 1) << 0;
	}

	function extend() {
		var i, key, result = {},
			args = Array.prototype.slice.call(arguments);
		for (i = 0; i < args.length; i++) {
			for (key in args[i]) {
				result[key] = args[i][key];
			}
		}
		return result;
	}

}(this));