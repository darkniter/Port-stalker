from transliterate import get_available_language_codes, translit
from transliterate.base import TranslitLanguagePack, registry


class ExampleLanguagePack(TranslitLanguagePack):
    language_code = "example"
    language_name = "Example"
    mapping = {u"",
               u""}

    pre_processor_mapping = {
                        u'А': u'A',
                        u'Б': u'B',
                        u'В': u'V',
                        u'Г': u'G',
                        u'Д': u'D',
                        u'Е': u'E',
                        u'Ё': u'E',
                        u'Ж': u'Zh',
                        u'З': u'Z',
                        u'И': u'I',
                        u'Й': u'Y',
                        u'К': u'K',
                        u'Л': u'L',
                        u'М': u'M',
                        u'Н': u'N',
                        u'О': u'O',
                        u'П': u'P',
                        u'Р': u'R',
                        u'С': u'S',
                        u'Т': u'T',
                        u'У': u'U',
                        u'Ф': u'F',
                        u'Х': u'H',
                        u'Ц': u'Ts',
                        u'Ч': u'Ch',
                        u'Ш': u'Sh',
                        u'Щ': u'Sch',
                        u'Ъ': u'',
                        u'Ы': u'Y',
                        u'Ь': u'',
                        u'Э': u'E',
                        u'Ю': u'Yu',
                        u'Я': u'Ya',
                        u'а': u'a',
                        u'б': u'b',
                        u'в': u'v',
                        u'г': u'g',
                        u'д': u'd',
                        u'е': u'e',
                        u'ё': u'e',
                        u'ж': u'zh',
                        u'з': u'z',
                        u'и': u'i',
                        u'й': u'y',
                        u'к': u'k',
                        u'л': u'l',
                        u'м': u'm',
                        u'н': u'n',
                        u'о': u'o',
                        u'п': u'p',
                        u'р': u'r',
                        u'с': u's',
                        u'т': u't',
                        u'у': u'u',
                        u'ф': u'f',
                        u'х': u'h',
                        u'ц': u'ts',
                        u'ч': u'ch',
                        u'ш': u'sh',
                        u'щ': u'sch',
                        u'ъ': u'',
                        u'ы': u'y',
                        u'ь': u'',
                        u'э': u'e',
                        u'ю': u'yu',
                        u'я': u'ya',
                }


registry.register(ExampleLanguagePack, force=True)

print(get_available_language_codes())

# ['el', 'hy', 'ka', 'ru', 'example']
text = '40 лет Октября'


def transliterate(text):
    trans = translit(text, 'example')
    print(trans)
    return trans


if __name__ == "__main__":
    transliterate('Коммунистическая')
# Lor5m 9psum 4olor s9t 1m5t
