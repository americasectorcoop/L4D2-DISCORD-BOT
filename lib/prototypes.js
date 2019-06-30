"use strict";

if(!String.prototype.replaceAll) {
	/**
	 * Metodo para remplazar una busqueda en un string
	 * @param {string|array} search
	 * @param {string|array} replacement
	 */
	String.prototype.replaceAll = function (search, replacements) {
		let value = this.valueOf();
		/** Verificando si es un array search */
		if (Array.isArray(search)) {
			/** Verificando si es un array replacement */
			if (Array.isArray(replacements)) {
				let last_replace = '';
				/** Recorriendo los datos */
				for (let i = 0, long = search.length; i < long; i++) {
					let replace = '';
					let replacement = replacements[i];
					/** Verificando existencia */
					if (typeof replacement == 'string' && replacement !== '') {
						last_replace = replacement;
						replace = replacement;
					} else {
						replace = last_replace;
					}
					value = value.split(search[i]).join(replace);
				}
			} else {
				/** Recorriendo datos */
				for (let i = 0, long = search.length; i < long; i++) {
					value = value.split(search[i]).join(replacements);
				}
			}
			return value;
		}
		return value.split(search).join(replacements);
	};
}

if(!String.prototype.capitalize) {
	String.prototype.capitalize = function() {
		let value = this.valueOf();
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
}