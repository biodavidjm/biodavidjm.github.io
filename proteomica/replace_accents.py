import os

# Diccionario de reemplazos
replacements = {
    'á': '&aacute;',
    'é': '&eacute;',
    'í': '&iacute;',
    'ó': '&oacute;',
    'ú': '&uacute;',
    'ñ': '&ntilde;',
    'Á': '&Aacute;',
    'É': '&Eacute;',
    'Í': '&Iacute;',
    'Ó': '&Oacute;',
    'Ú': '&Uacute;',
    'Ñ': '&Ntilde;'
}

# Procesar todos los archivos .htm en el directorio actual
for filename in os.listdir('.'):
    if filename.endswith('.htm'):
        # Leer el contenido del archivo utilizando la codificación ISO-8859-1
        with open(filename, 'r', encoding='ISO-8859-1') as file:
            content = file.read()

        # Reemplazar caracteres
        for original, replacement in replacements.items():
            content = content.replace(original, replacement)

        # Guardar el contenido modificado de vuelta al archivo en UTF-8
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(content)

        print(f"Reemplazos completados en {filename}")
