image_types = ['.jpg', '.png', '.jpeg', '.bmp', '.gif', '.mp4', '.tiff', 'svg']

def increment_entry(name_dict, entry):
    if entry not in name_dict:
        name_dict[entry] = 1
    else:
        name_dict[entry] += 1


def average(avg_num, addition, divisor):
    return ((avg_num * divisor) + addition) / (divisor + 1)
