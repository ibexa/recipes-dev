<?php

/**
 * @copyright Copyright (C) Ibexa AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 */
declare(strict_types=1);

use Rector\Config\RectorConfig;

return static function (RectorConfig $rectorConfig): void {
    $rectorConfig->paths(
        [
            __DIR__ . '/src', // see if it matches your project structure
            __DIR__ . '/tests',
        ]
    );

    // define sets of rules
    $rectorConfig->sets(
        [
            __DIR__ . '/vendor/ibexa/rector/src/contracts/Sets/ibexa-50.php', // rule set for upgrading to Ibexa DXP 5.0
        ]
    );
};
